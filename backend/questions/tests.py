from rest_framework.test import APITestCase
from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from questions.models import Question, Response, Comment
from django.urls import reverse

class BaseAPITest(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email='test1@example.com', password='test123')
        self.user2 =User.objects.create_user(email='test2@example.com', password='test123')

        self.token1 = RefreshToken.for_user(self.user1)
        self.token2 = RefreshToken.for_user(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token1.access_token))


class question_apitest(BaseAPITest):
    def setUp(self):
        super().setUp()

        self.question = Question.objects.create(
            title='Test Question',
            body='Test description',
            author=self.user1
        )

    def test_get_all_questions(self):
            response = self.client.get(reverse('question_list_create'))
            self.assertEqual(response.status_code, 200)
            self.assertTrue('results' in response.data)

    def test_create_question(self):
        data = {
            'title': 'New Question',
            'body': 'New description'
        }
        response = self.client.post(reverse('question_list_create'), data, format = 'json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'New Question')

    def test_get_single_question(self):
        response = self.client.get(reverse('question_detail',kwargs ={'question_pk':self.question.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.question.title)

    def test_patch_question(self):
        data = {'title': 'Updated Title'}
        response = self.client.patch(reverse('question_detail',kwargs ={'question_pk':self.question.id}), data, format = 'json' )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Updated Title')

    def test_delete_question(self):
        response = self.client.delete(reverse('question_detail',kwargs ={'question_pk':self.question.id})
        )
        self.assertEqual(response.status_code, 204)

    def test_user_can_patch_question(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))

        data = {'title': 'Updated Title'}
        response = self.client.patch(reverse('question_detail',kwargs ={'question_pk':self.question.id}), data, format = 'json' )
        self.assertEqual(response.status_code, 403)

    def test_user_can_delete_question(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))
        response = self.client.delete(reverse('question_detail',kwargs ={'question_pk':self.question.id})
        )
        self.assertEqual(response.status_code, 403)





class ResponseAPIViewTest(BaseAPITest):
    def setUp(self):
        super().setUp()

        self.question = Question.objects.create(
            title='Test Question',
            body='Test question body',
            author=self.user1
        )

        self.response  = Response.objects.create(
            body ='test response',
            author = self.user1,
            question = self.question
        )
    def test_get_all_responses_on_question(self):
        response = self.client.get(reverse('response_list_create',kwargs ={'question_pk':self.question.id}))
        self.assertEqual(response.status_code,200)
     
    def test_create_response(self):
        data ={
            'body' : 'test response',   
            
        }
        response =self.client.post(reverse('response_list_create',kwargs ={'question_pk':self.question.id}),data,format = 'json')
        self.assertEqual(response.status_code, 201) 
        self.assertEqual(response.data['body'], 'test response')

    def test_get_single_response(self):
        response = self.client.get(reverse('response_detail',kwargs ={'response_pk':self.response.id}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['body'], self.response.body)

    def test_patch_response(self):
        data = {'body' : 'updated response'}
        response = self.client.patch(reverse('response_detail',kwargs ={'response_pk':self.response.id}),data, format = 'json' )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['body'], 'updated response')

    def test_delete_response(self):
        response = self.client.delete(reverse('response_detail',kwargs ={'response_pk':self.response.id}))
        self.assertEqual(response.status_code, 204)

    def test_user_can_patch_response(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))

        data = {'body' : 'updated response'}
        response = self.client.patch(reverse('response_detail',kwargs ={'response_pk':self.response.id}),data, format = 'json' )

        self.assertEqual(response.status_code, 403)

    def test_user_can_delete_response(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))

        response = self.client.delete(reverse('response_detail',kwargs ={'response_pk':self.response.id}))
        self.assertEqual(response.status_code, 403)
class CommentAPIViewTest(BaseAPITest):
    def setUp(self):
        super().setUp()


        self.question = Question.objects.create(
            title='Test Question',
            body='Test question body',
            author=self.user1
        )
        self.response  = Response.objects.create(
            body ='test response',
            author = self.user1,
            question = self.question
        )
        self.comment =Comment.objects.create(
            author = self.user1,
            body = 'test body',
            response = self.response
        )
        self.replies = Comment.objects.create(
             author = self.user1,
             body = 'test replie',
             parent_comment = self.comment

        )

    def test_get_all_comments_on_response(self):
        response = self.client.get(reverse('response_comment_list_create', kwargs = {'response_pk' :self.response.id}))
        self.assertEqual(response.status_code, 200)

    def test_get_all_replies_on_comment(self):
        response = self.client.get(reverse('comment_comment_list_create',kwargs ={'comment_pk' : self.comment.id}))
        self.assertEqual(response.status_code,200)
    

    def test_post_comment_on_response(self):
        data ={
            'body': 'test comment',
            }
        response1 = self.client.post(reverse('response_comment_list_create', kwargs = {'response_pk' :self.response.id}),data, format ='json')
        response2 = self.client.post(reverse('comment_comment_list_create', kwargs = {'comment_pk' : self.comment.id}),data, format ='json')
    
        self.assertEqual(response1.status_code, 201)
        self.assertEqual(response1.data['body'], 'test comment')

        self.assertEqual(response2.status_code, 201)
        self.assertEqual(response2.data['body'], 'test comment')

    def test_patch_comment(self):
        data ={
            'body': 'updated body'
            }
        response = self.client.patch(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}),data,format = 'json')
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.data['body'],'updated body')
    
    def test_delete_comment(self):
        response = self.client.delete(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}))
        self.assertEqual(response.status_code, 204)

    def test_user_can_patch_comment(self):
        data ={
            'body': 'updated body'
            }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))
        response = self.client.patch(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}),data,format = 'json')
        self.assertEqual(response.status_code,403)
    
    def test_user_can_delete_comment(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))
        response = self.client.delete(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}))
        self.assertEqual(response.status_code, 403)

class UpvoteApiViewTest(BaseAPITest):
    def setUp(self):
        super().setUp()

        
        self.question = Question.objects.create(
            title='Test Question',
            body='Test question body',
            author=self.user1
        )
    def test_post_upvote(self):
        data = {
            'entity_type' :'question'
        }
        response =self.client.post(reverse('post_upvote',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
        self.assertEqual(response.status_code, 201)
    
    def test_get_upvote_count(self):
        data = {
            'entity_type' :'question'
        }
        response =self.client.post(reverse('get_upvote_count',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
        self.assertEqual(response.status_code, 200)
    def test_get_all_upvotes(self):
        data = {
            'entity_type' :'question'
        }
        response =self.client.post(reverse('get_upvote_count',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
        self.assertEqual(response.status_code, 200)

    def test_delete_upvote(self):
        data = {
            'entity_type' :'question'
        }
        response =self.client.post(reverse('delete_upvote',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
        self.assertEqual(response.status_code, 204)
    
        def test_one_upvote_per_person(self):
            data = {
                'entity_type' :'question'
            }
            response =self.client.post(reverse('get_upvote_count',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
            response1 =self.client.post(reverse('get_upvote_count',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )

            self.assertEqual(response1.status_code, 400)

        def test_user_can_delete_upvote(self):
            self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(self.token2.access_token))

            data = {
                'entity_type' :'question'
            }
            response =self.client.post(reverse('delete_upvote',kwargs = {'target_pk' : self.question.id}),data, format = 'json' )
            self.assertEqual(response.status_code, 400)

