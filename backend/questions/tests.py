from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User
from questions.models import Question, Response, Comment

class QuestionAPIViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user( password='testpass',email = 'kamal@kamal.com')
        self.client.force_authenticate(user=self.user)

        self.question = Question.objects.create(
            title='Test Question',
            body='Test description',
            author=self.user
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
        response = self.client.patch(reverse('question_detail',kwargs ={'question_pk':self.question.id}), data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Updated Title')

    def test_delete_question(self):
        response = self.client.delete(reverse('question_detail',kwargs ={'question_pk':self.question.id})
        )
        self.assertEqual(response.status_code, 204)


class ResponseAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user( password='testpass',email = 'kamal@kamal.com')
        self.client.force_authenticate(user=self.user)

        self.question = Question.objects.create(
            title='Test Question',
            body='Test question body',
            author=self.user
        )

        self.response  = Response.objects.create(
            body ='test response',
            upvotes = 2,
            author = self.user,
            question = self.question
        )
    def test_get_all_responses_on_question(self):
        response = self.client.get(reverse('response_list_create',kwargs ={'question_pk':self.question.id}))
        self.assertEqual(response.status_code,200)
     
    # sscscdc
    def test_create_response(self):
        data ={
            'body' : 'test response',   
            'upvotes' : 2
        }
        response =self.client.post(reverse('response_list_create',kwargs ={'question_pk':self.question.id}),data,format = 'json')
        self.assertEqual(response.status_code, 201) 
        self.assertEqual(response.data['body'], 'test response')

    def test_get_single_response(self):
        response = self.client.get(reverse('response_detail',kwargs ={'response_pk':self.response.id}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['body'], self.response.body)

    def test_patch_response(self):
        data = {'upvotes' : 3}
        response = self.client.patch(reverse('response_detail',kwargs ={'response_pk':self.response.id}),data, format = 'json' )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['upvotes'], 3)

    def test_delete_response(self):
        response = self.client.delete(reverse('response_detail',kwargs ={'response_pk':self.response.id}))
        self.assertEqual(response.status_code, 204)


class CommentAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email = 'kamal@kamal.com')
        self.client.force_authenticate(user = self.user)


        self.question = Question.objects.create(
            title='Test Question',
            body='Test question body',
            author=self.user
        )
        self.response  = Response.objects.create(
            body ='test response',
            upvotes = 2,
            author = self.user,
            question = self.question
        )
        self.comment =Comment.objects.create(
            author = self.user,
            body = 'test body',
            upvotes = 2,
            response = self.response
        )
        self.replies = Comment.objects.create(
             author = self.user,
             body = 'test replie',
             upvotes = 2,
             parent_comment = self.comment

        )

    def test_get_all_comments_on_response(self):
        response = self.client.get(reverse('response_comment_list_create', kwargs = {'response_pk' :self.response.id}))
        self.assertEqual(response.status_code, 200)


    def test_post_comment_on_response(self):
        data ={
            'body': 'test comment',
            'upvotes': 2
            }
        response = self.client.post(reverse('response_comment_list_create', kwargs = {'response_pk' :self.response.id}),data, format ='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['body'], 'test comment')

    def test_get_all_replies_on_comment(self):
        response = self.client.get(reverse('comment_comment_list_create',kwargs ={'comment_pk' : self.comment.id}))
        self.assertEqual(response.status_code,200)
    

    def test_post_replie_on_comment(self):
        data ={
            'body': 'test comment',
            'upvotes': 2
            }
        response = self.client.post(reverse('comment_comment_list_create', kwargs = {'comment_pk' : self.comment.id}),data, format ='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['body'], 'test comment')
    

    def test_patch_comment(self):
        data ={
            'upvotes': 5
            }
        response = self.client.patch(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}),data,format = 'json')
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.data['upvotes'],5)
    
    def test_delete_comment(self):
        response = self.client.delete(reverse('comment_detail',kwargs = {'comment_pk' : self.comment.id}))
        self.assertEqual(response.status_code, 204)
