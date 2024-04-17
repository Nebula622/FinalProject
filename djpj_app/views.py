from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import redirect
import json
import requests
import subprocess
import openai
import os
import tempfile
# from bardapi.constants import SESSION_HEADERS
from bardapi import Bard
from .models import User
from .models import FairyTale
from .models import UserProgress
from .API_KEY import OPEN_API_KEY
# from .BARD_KEY import BARD_1PSID_TOKEN, BARD_1PSIDTS_TOKEN, BARD_1PSIDCC_TOKEN
openai.api_key = OPEN_API_KEY
from .gpt_prompts import GPT_IS_PYTHON
from .gpt_prompts import GPT_ASK_QUESTION


session = requests.Session()
# session.headers = SESSION_HEADERS
# session.cookies.set("__Secure-1PSID", BARD_1PSID_TOKEN)
# session.cookies.set("__Secure-1PSIDTS", BARD_1PSIDTS_TOKEN)
# session.cookies.set("__Secure-1PSIDCC", BARD_1PSIDCC_TOKEN)

#미리 정의된 함수
def load_conversations(filename, part_key):
    file_path = f'djpj_app/static/json/{filename}'
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        jsons = data.get(part_key, [])
        conversations_json = json.dumps(jsons)
        return conversations_json
    
def execute_code(request):
    if request.method == 'POST':
        print("try to execute")        
        try:
            python_code = request.POST.get('python_code', '')
            print(python_code)
            # Create a temporary Python script file
            with tempfile.NamedTemporaryFile(mode='w', delete=False, encoding='utf-8') as temp_file:
                temp_file.write(python_code)
            # Run the Python script using the created file
            result = subprocess.check_output(['python', temp_file.name], stderr=subprocess.STDOUT, text=True)
            print(result)
            output_lines = result.splitlines()
            return JsonResponse({'result': output_lines})

        except subprocess.CalledProcessError as e:
            print(e)
            return JsonResponse({'error': e.stdout}, status=500)
        finally:
            # Cleanup: Delete the temporary file
            if 'temp_file' in locals():
                temp_file.close()
                # Unlink the temporary file
                os.unlink(temp_file.name)
    else:
        print("Error..TT")
        return JsonResponse({'error': 'Invalid request method'}, status=400)

# 세션 관련함수
def logout_and_home(request):
# Clear the session
    request.session.pop('user', None)
    print(session)
    return redirect('home')   

def check_session(request, html, conversations_json=None):
    user_id = request.session.get('user')
    if user_id:
        user = User.objects.get(username=user_id)
        context = {'user': user}

        if conversations_json is not None:
            context['conversations'] = conversations_json

        return render(request, html, context)
    else:
        message = "앗! 로그인이 필요해!"  # Add this line
        return render(request, 'home.html', {'message': message}) 

def savepage(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        fairytale = request.POST.get('fairytale', '')
        page = request.POST.get('page', '')      
        print(page)
        fairytale_id = FairyTale.objects.get(name = fairytale).id
        username_id = User.objects.get(username=username).id    
        try:
            # Try to get an existing UserProgress entry with the given username_id and fairytale_id
            userprogress = UserProgress.objects.get(username_id=username_id, fairytale_id=fairytale_id)
            # If it exists, update the progress
            userprogress.progress = page
            userprogress.save()
        except UserProgress.DoesNotExist:
            # If it doesn't exist, create a new UserProgress entry
            userprogress = UserProgress(username_id=username_id, fairytale_id=fairytale_id, progress=page)
            userprogress.save()
        return JsonResponse({'status': 'success'})

def load_progress(request):
    if request.method == 'POST':
        
        username = request.POST.get('username', '')
        fairytale = request.POST.get('fairytale', '')
        fairytale_id = FairyTale.objects.get(name = fairytale).id
        username_id = User.objects.get(username=username).id    
        try:
            # Try to get an existing UserProgress entry with the given username_id and fairytale_id
            userprogress = UserProgress.objects.get(username_id=username_id, fairytale_id=fairytale_id)
            # If it exists, update the progress
            page = userprogress.progress
            if page < 10:
                page = "0" + str(page)     
            page = "/" + str(page)
            return JsonResponse({'status': 'success', 'page': page})
        except UserProgress.DoesNotExist:
            page = "/intro"
            return JsonResponse({'status': 'error', 'page': page, 'message': '이 동화는 본적이 없는거 같아...'})
 
def saverobot(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        robot = request.POST.get('robot', '')
        
        if robot == "":
            return JsonResponse({'status': 'error', 'message': '이름을 지어줘!'})
        try:
            user = User.objects.get(username=username)
            user.robotname = robot
            user.save()
            return JsonResponse({'status': 'success', 'message': robot +'! 좋은 이름이야!'})
        except :
            return JsonResponse({'status': 'error', 'message': '에러? 가 발생했다!'})
    
#로그인 및 회원가입
def userlogin(request):
    print("login")
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
               
        if username == '':
            return JsonResponse({'status': 'error', 'message': '이름 적는걸 잊었어!'})
        if password == '':
            return JsonResponse({'status': 'error', 'message': '암호 적는걸 잊었어!'})
        try:
            user = User.objects.get(username=username)
            print("Success")
            if user.password == password:
                # Login successful
                request.session['user'] = user.username
                return JsonResponse({'status': 'success'})
            else:
                # Password does not match
                return JsonResponse({'status': 'error', 'message': '어라? ' + username +', 뭔가 틀린거 같은데, 다시 생각해봐!'})
        except User.DoesNotExist:
            # User does not exist
            return JsonResponse({'status': 'error', 'message': '어라? ' + username +', 처음듣는 이름인걸? 혹시 처음이야?'})

    return render(request, 'login.html')
        
def usersignin(request):
    print("signin")
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        password_check = request.POST.get('password_check', '')
        
        if username == '':
            return JsonResponse({'status': 'error', 'message': '이름 적는걸 잊었어!'})
        if password == '':
            return JsonResponse({'status': 'error', 'message': '암호 적는걸 잊었어!'})
        if password_check == '':
            return JsonResponse({'status': 'error', 'message': '암호 확인하는걸 잊었어!'})
        try:
            user = User.objects.get(username=username)
            return JsonResponse({'status': 'error', 'message': '앗! 미안! ' + username +'이라는 이름은 이미 사용중이야! 다른 이름으로 부탁해!'})
        except User.DoesNotExist:
            # User does not exist
            if password == password_check:
                user = User(username = username, password = password)
                user.save()
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error', 'message': '어라? 암호를 다시 체크해 줄래?'})
    return render(request, 'signin.html') 

#gpt통신코드
def gpt_connection(prompt):
    messages = []
    prompt = prompt
    messages.append({'role': 'user', 'content': prompt})
    print(prompt)
    query = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = messages,
        n = 1,
        stop = None,
        temperature = 0.5,
    )
    response = query['choices'][0]['message']['content']
    print(response)
    return response

def get_completion(request):
    print("use gpt")
    if request.method == 'POST': 
        print("gpt request")
        print(request)
        prompt = request.POST.get('prompt') 
        prompt=str(prompt)
        prompt_is_valid = prompt + "\n"+ GPT_IS_PYTHON
        response = gpt_connection(prompt_is_valid)
        if response == "False" or response == "False.":
            response = "파이썬 코딩과 관련없는 질문인 것 같아..."
            return JsonResponse({'response': response}) 
        else:   
            prompt_get_answer = prompt + "\n" + GPT_ASK_QUESTION
            response = gpt_connection(prompt_get_answer)
            response = response.replace(". ", ".<br>").replace("\n", "<br>").replace(" ", "&nbsp;").replace("```python","======예시코드======").replace("```","===================")
            print(response)
            return JsonResponse({'response': response}) 

#페이지 불러오는 함수
def homepage(request):
    print("homepage")
    return render(request, 'home.html') 

def fairytale_home(request):
    print("fairytale_home")
    return check_session(request=request, html= 'fairytale_home.html', conversations_json=None)

#백설공주 1장
def snowwhite_home(request):
    print("snowwhite_home")
    conversations_json = load_conversations("snowwhite.json", "intro")
    return check_session(request=request, html= 'snowwhite/snowwhite_home.html', conversations_json=conversations_json)

def snowwhite_01(request):
    print("snowwhite_01")
    conversations_json = load_conversations("snowwhite.json", "01")
    return check_session(request=request, html= 'snowwhite/snowwhite_01.html', conversations_json=conversations_json)
    
def snowwhite_02(request):
    print("snowwhite_02")
    conversations_json = load_conversations("snowwhite.json", "02")
    return check_session(request=request, html= 'snowwhite/snowwhite_02.html', conversations_json=conversations_json)

def snowwhite_03(request):
    print("snowwhite_03")
    conversations_json = load_conversations("snowwhite.json", "03")
    return check_session(request=request, html= 'snowwhite/snowwhite_03.html', conversations_json=conversations_json)

def snowwhite_04(request):
    print("snowwhite_04")
    conversations_json = load_conversations("snowwhite.json", "04")
    return check_session(request=request, html= 'snowwhite/snowwhite_04.html', conversations_json=conversations_json)

def snowwhite_05(request):
    print("snowwhite_05")
    conversations_json = load_conversations("snowwhite.json", "05")
    return check_session(request=request, html= 'snowwhite/snowwhite_05.html', conversations_json=conversations_json)

def snowwhite_06(request):
    print("snowwhite_06")
    conversations_json = load_conversations("snowwhite.json", "06")
    return check_session(request=request, html= 'snowwhite/snowwhite_06.html', conversations_json=conversations_json)

def snowwhite_07(request):
    print("snowwhite_07")
    conversations_json = load_conversations("snowwhite.json", "07")
    return check_session(request=request, html= 'snowwhite/snowwhite_07.html', conversations_json=conversations_json)

def snowwhite_08(request):
    print("snowwhite_08")
    conversations_json = load_conversations("snowwhite.json", "08")
    return check_session(request=request, html= 'snowwhite/snowwhite_08.html', conversations_json=conversations_json)

def snowwhite_09(request):
    print("snowwhite_09")
    conversations_json = load_conversations("snowwhite.json", "09")
    return check_session(request=request, html= 'snowwhite/snowwhite_09.html', conversations_json=conversations_json)

def snowwhite_10(request):
    print("snowwhite_10")
    conversations_json = load_conversations("snowwhite.json", "10")
    return check_session(request=request, html= 'snowwhite/snowwhite_10.html', conversations_json=conversations_json)

def snowwhite_11(request):
    print("snowwhite_11")
    conversations_json = load_conversations("snowwhite.json", "11")
    return check_session(request=request, html= 'snowwhite/snowwhite_11.html', conversations_json=conversations_json)

def snowwhite_12(request):
    print("snowwhite_12")
    conversations_json = load_conversations("snowwhite.json", "12")
    return check_session(request=request, html= 'snowwhite/snowwhite_12.html', conversations_json=conversations_json)

def snowwhite_13(request):
    print("snowwhite_13")
    conversations_json = load_conversations("snowwhite.json", "13")
    return check_session(request=request, html= 'snowwhite/snowwhite_13.html', conversations_json=conversations_json)

def snowwhite_14(request):
    print("snowwhite_14")
    conversations_json = load_conversations("snowwhite.json", "14")
    return check_session(request=request, html= 'snowwhite/snowwhite_14.html', conversations_json=conversations_json)

def snowwhite_15(request):
    print("snowwhite_15")
    conversations_json = load_conversations("snowwhite.json", "15")
    return check_session(request=request, html= 'snowwhite/snowwhite_15.html', conversations_json=conversations_json)

def snowwhite_16(request):
    print("snowwhite_16")
    conversations_json = load_conversations("snowwhite.json", "16")
    return check_session(request=request, html= 'snowwhite/snowwhite_16.html', conversations_json=conversations_json)

def snowwhite_17(request):
    print("snowwhite_17")
    conversations_json = load_conversations("snowwhite.json", "17")
    return check_session(request=request, html= 'snowwhite/snowwhite_17.html', conversations_json=conversations_json)

def snowwhite_18(request):
    print("snowwhite_18")
    conversations_json = load_conversations("snowwhite.json", "18")
    return check_session(request=request, html= 'snowwhite/snowwhite_18.html', conversations_json=conversations_json)

def snowwhite_19(request):
    print("snowwhite_19")
    conversations_json = load_conversations("snowwhite.json", "19")
    return check_session(request=request, html= 'snowwhite/snowwhite_19.html', conversations_json=conversations_json)

def snowwhite_20(request):
    print("snowwhite_20")
    conversations_json = load_conversations("snowwhite.json", "20")
    return check_session(request=request, html= 'snowwhite/snowwhite_20.html', conversations_json=conversations_json)

def snowwhite_21(request):
    print("snowwhite_21")
    conversations_json = load_conversations("snowwhite.json", "21")
    return check_session(request=request, html= 'snowwhite/snowwhite_21.html', conversations_json=conversations_json)
    
def snowwhite_22(request):
    print("snowwhite_22")
    conversations_json = load_conversations("snowwhite.json", "22")
    return check_session(request=request, html= 'snowwhite/snowwhite_22.html', conversations_json=conversations_json)

def snowwhite_23(request):
    print("snowwhite_23")
    conversations_json = load_conversations("snowwhite.json", "23")
    return check_session(request=request, html= 'snowwhite/snowwhite_23.html', conversations_json=conversations_json)

def snowwhite_24(request):
    print("snowwhite_24")
    conversations_json = load_conversations("snowwhite.json", "24")
    return check_session(request=request, html= 'snowwhite/snowwhite_24.html', conversations_json=conversations_json)

def snowwhite_25(request):
    print("snowwhite_25")
    conversations_json = load_conversations("snowwhite.json", "25")
    return check_session(request=request, html= 'snowwhite/snowwhite_25.html', conversations_json=conversations_json)

def snowwhite_26(request):
    print("snowwhite_26")
    conversations_json = load_conversations("snowwhite.json", "26")
    return check_session(request=request, html= 'snowwhite/snowwhite_26.html', conversations_json=conversations_json)

def snowwhite_test01(request):
    print("snowwhite_test01")
    conversations_json = load_conversations("snowwhite.json", "test01")
    return check_session(request=request, html= 'snowwhite/snowwhite_test01.html', conversations_json=conversations_json)

def snowwhite_test02(request):
    print("snowwhite_test02")
    conversations_json = load_conversations("snowwhite.json", "test02")
    return check_session(request=request, html= 'snowwhite/snowwhite_test02.html', conversations_json=conversations_json)

def snowwhite_test03(request):
    print("snowwhite_test03")
    conversations_json = load_conversations("snowwhite.json", "test03")
    return check_session(request=request, html= 'snowwhite/snowwhite_test03.html', conversations_json=conversations_json)

def snowwhite_test04(request):
    print("snowwhite_test04")
    conversations_json = load_conversations("snowwhite.json", "test04")
    return check_session(request=request, html= 'snowwhite/snowwhite_test04.html', conversations_json=conversations_json)

def snowwhite_test05(request):
    print("snowwhite_test05")
    conversations_json = load_conversations("snowwhite.json", "test05")
    return check_session(request=request, html= 'snowwhite/snowwhite_test05.html', conversations_json=conversations_json)


#백설공주 2장
def snowwhite2_intro(request):
    print("snowwhite2_intro")
    conversations_json = load_conversations("snowwhite2.json", "intro")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_intro.html', conversations_json=conversations_json)

def snowwhite2_01(request):
    print("snowwhite2_01")
    conversations_json = load_conversations("snowwhite2.json", "01")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_01.html', conversations_json=conversations_json)
    
def snowwhite2_02(request):
    print("snowwhite2_02")
    conversations_json = load_conversations("snowwhite2.json", "02")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_02.html', conversations_json=conversations_json)

def snowwhite2_03(request):
    print("snowwhite2_03")
    conversations_json = load_conversations("snowwhite2.json", "03")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_03.html', conversations_json=conversations_json)

def snowwhite2_04(request):
    print("snowwhite2_04")
    conversations_json = load_conversations("snowwhite2.json", "04")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_04.html', conversations_json=conversations_json)

def snowwhite2_05(request):
    print("snowwhite2_05")
    conversations_json = load_conversations("snowwhite2.json", "05")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_05.html', conversations_json=conversations_json)

def snowwhite2_06(request):
    print("snowwhite2_06")
    conversations_json = load_conversations("snowwhite2.json", "06")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_06.html', conversations_json=conversations_json)

def snowwhite2_07(request):
    print("snowwhite2_07")
    conversations_json = load_conversations("snowwhite2.json", "07")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_07.html', conversations_json=conversations_json)

def snowwhite2_08(request):
    print("snowwhite2_08")
    conversations_json = load_conversations("snowwhite2.json", "08")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_08.html', conversations_json=conversations_json)

def snowwhite2_09(request):
    print("snowwhite2_09")
    conversations_json = load_conversations("snowwhite2.json", "09")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_09.html', conversations_json=conversations_json)

def snowwhite2_10(request):
    print("snowwhite2_10")
    conversations_json = load_conversations("snowwhite2.json", "10")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_10.html', conversations_json=conversations_json)

def snowwhite2_11(request):
    print("snowwhite2_11")
    conversations_json = load_conversations("snowwhite2.json", "11")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_11.html', conversations_json=conversations_json)
    
def snowwhite2_12(request):
    print("snowwhite2_12")
    conversations_json = load_conversations("snowwhite2.json", "12")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_12.html', conversations_json=conversations_json)

def snowwhite2_13(request):
    print("snowwhite2_13")
    conversations_json = load_conversations("snowwhite2.json", "13")  # Updated to "13"
    return check_session(request=request, html= 'snowwhite2/snowwhite2_13.html', conversations_json=conversations_json)  

def snowwhite2_14(request):
    print("snowwhite2_14")
    conversations_json = load_conversations("snowwhite2.json", "14")  # Updated to "14"
    return check_session(request=request, html= 'snowwhite2/snowwhite2_14.html', conversations_json=conversations_json)  

def snowwhite2_15(request):
    print("snowwhite2_15")
    conversations_json = load_conversations("snowwhite2.json", "15")  # Updated to "15"
    return check_session(request=request, html= 'snowwhite2/snowwhite2_15.html', conversations_json=conversations_json)  

def snowwhite2_16(request):
    print("snowwhite2_16")
    conversations_json = load_conversations("snowwhite2.json", "16")  # Updated to "16"
    return check_session(request=request, html= 'snowwhite2/snowwhite2_16.html', conversations_json=conversations_json)  

def snowwhite2_17(request):
    print("snowwhite2_17")
    conversations_json = load_conversations("snowwhite2.json", "17")  # Updated to "17"
    return check_session(request=request, html= 'snowwhite2/snowwhite2_17.html', conversations_json=conversations_json)  

def snowwhite2_test01(request):
    print("snowwhite2_test01")
    conversations_json = load_conversations("snowwhite2.json", "test01")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_test01.html', conversations_json=conversations_json)

def snowwhite2_test02(request):
    print("snowwhite2_test02")
    conversations_json = load_conversations("snowwhite2.json", "test02")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_test02.html', conversations_json=conversations_json)

def snowwhite2_test03(request):
    print("snowwhite2_test03")
    conversations_json = load_conversations("snowwhite2.json", "test03")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_test03.html', conversations_json=conversations_json)

def snowwhite2_test04(request):
    print("snowwhite2_test04")
    conversations_json = load_conversations("snowwhite2.json", "test04")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_test04.html', conversations_json=conversations_json)

def snowwhite2_test05(request):
    print("snowwhite2_test05")
    conversations_json = load_conversations("snowwhite2.json", "test05")
    return check_session(request=request, html= 'snowwhite2/snowwhite2_test05.html', conversations_json=conversations_json)


#백설공주 3장
def snowwhite3_intro(request):
    print("snowwhite3_intro")
    conversations_json = load_conversations("snowwhite3.json", "intro")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_intro.html', conversations_json=conversations_json)

def snowwhite3_01(request):
    print("snowwhite3_01")
    conversations_json = load_conversations("snowwhite3.json", "01")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_01.html', conversations_json=conversations_json)
    
def snowwhite3_02(request):
    print("snowwhite3_02")
    conversations_json = load_conversations("snowwhite3.json", "02")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_02.html', conversations_json=conversations_json)

def snowwhite3_03(request):
    print("snowwhite3_03")
    conversations_json = load_conversations("snowwhite3.json", "03")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_03.html', conversations_json=conversations_json)

def snowwhite3_04(request):
    print("snowwhite3_04")
    conversations_json = load_conversations("snowwhite3.json", "04")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_04.html', conversations_json=conversations_json)

def snowwhite3_05(request):
    print("snowwhite3_05")
    conversations_json = load_conversations("snowwhite3.json", "05")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_05.html', conversations_json=conversations_json)

def snowwhite3_06(request):
    print("snowwhite3_06")
    conversations_json = load_conversations("snowwhite3.json", "06")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_06.html', conversations_json=conversations_json)

def snowwhite3_07(request):
    print("snowwhite3_07")
    conversations_json = load_conversations("snowwhite3.json", "07")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_07.html', conversations_json=conversations_json)

def snowwhite3_08(request):
    print("snowwhite3_08")
    conversations_json = load_conversations("snowwhite3.json", "08")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_08.html', conversations_json=conversations_json)

def snowwhite3_09(request):
    print("snowwhite3_09")
    conversations_json = load_conversations("snowwhite3.json", "09")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_09.html', conversations_json=conversations_json)

def snowwhite3_10(request):
    print("snowwhite3_10")
    conversations_json = load_conversations("snowwhite3.json", "10")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_10.html', conversations_json=conversations_json)

def snowwhite3_11(request):
    print("snowwhite3_11")
    conversations_json = load_conversations("snowwhite3.json", "11")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_11.html', conversations_json=conversations_json)
    
def snowwhite3_12(request):
    print("snowwhite3_12")
    conversations_json = load_conversations("snowwhite3.json", "12")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_12.html', conversations_json=conversations_json)

def snowwhite3_13(request):
    print("snowwhite3_13")
    conversations_json = load_conversations("snowwhite3.json", "13")  # Updated to "13"
    return check_session(request=request, html= 'snowwhite3/snowwhite3_13.html', conversations_json=conversations_json)  

def snowwhite3_test01(request):
    print("snowwhite3_test01")
    conversations_json = load_conversations("snowwhite3.json", "test01")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_test01.html', conversations_json=conversations_json)

def snowwhite3_test02(request):
    print("snowwhite3_test02")
    conversations_json = load_conversations("snowwhite3.json", "test02")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_test02.html', conversations_json=conversations_json)

def snowwhite3_test03(request):
    print("snowwhite3_test03")
    conversations_json = load_conversations("snowwhite3.json", "test03")
    return check_session(request=request, html= 'snowwhite3/snowwhite3_test03.html', conversations_json=conversations_json)

#백설공주 4장
def snowwhite4_intro(request):
    print("snowwhite4_intro")
    conversations_json = load_conversations("snowwhite4.json", "intro")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_intro.html', conversations_json=conversations_json)

def snowwhite4_01(request):
    print("snowwhite4_01")
    conversations_json = load_conversations("snowwhite4.json", "01")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_01.html', conversations_json=conversations_json)
    
def snowwhite4_02(request):
    print("snowwhite4_02")
    conversations_json = load_conversations("snowwhite4.json", "02")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_02.html', conversations_json=conversations_json)

def snowwhite4_03(request):
    print("snowwhite4_03")
    conversations_json = load_conversations("snowwhite4.json", "03")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_03.html', conversations_json=conversations_json)

def snowwhite4_04(request):
    print("snowwhite4_04")
    conversations_json = load_conversations("snowwhite4.json", "04")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_04.html', conversations_json=conversations_json)

def snowwhite4_05(request):
    print("snowwhite4_05")
    conversations_json = load_conversations("snowwhite4.json", "05")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_05.html', conversations_json=conversations_json)

def snowwhite4_06(request):
    print("snowwhite4_06")
    conversations_json = load_conversations("snowwhite4.json", "06")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_06.html', conversations_json=conversations_json)

def snowwhite4_07(request):
    print("snowwhite4_07")
    conversations_json = load_conversations("snowwhite4.json", "07")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_07.html', conversations_json=conversations_json)

def snowwhite4_08(request):
    print("snowwhite4_08")
    conversations_json = load_conversations("snowwhite4.json", "08")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_08.html', conversations_json=conversations_json)

def snowwhite4_09(request):
    print("snowwhite4_09")
    conversations_json = load_conversations("snowwhite4.json", "09")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_09.html', conversations_json=conversations_json)

def snowwhite4_10(request):
    print("snowwhite4_10")
    conversations_json = load_conversations("snowwhite4.json", "10")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_10.html', conversations_json=conversations_json)

def snowwhite4_11(request):
    print("snowwhite4_11")
    conversations_json = load_conversations("snowwhite4.json", "11")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_11.html', conversations_json=conversations_json)
    
def snowwhite4_12(request):
    print("snowwhite4_12")
    conversations_json = load_conversations("snowwhite4.json", "12")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_12.html', conversations_json=conversations_json)

def snowwhite4_test01(request):
    print("snowwhite4_test01")
    conversations_json = load_conversations("snowwhite4.json", "test01")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_test01.html', conversations_json=conversations_json)

def snowwhite4_test02(request):
    print("snowwhite4_test02")
    conversations_json = load_conversations("snowwhite4.json", "test02")
    return check_session(request=request, html= 'snowwhite4/snowwhite4_test02.html', conversations_json=conversations_json)

#백설공주 4장
def snowwhite5_intro(request):
    print("snowwhite5_intro")
    conversations_json = load_conversations("snowwhite5.json", "intro")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_intro.html', conversations_json=conversations_json)

def snowwhite5_01(request):
    print("snowwhite5_01")
    conversations_json = load_conversations("snowwhite5.json", "01")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_01.html', conversations_json=conversations_json)
    
def snowwhite5_02(request):
    print("snowwhite5_02")
    conversations_json = load_conversations("snowwhite5.json", "02")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_02.html', conversations_json=conversations_json)

def snowwhite5_03(request):
    print("snowwhite5_03")
    conversations_json = load_conversations("snowwhite5.json", "03")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_03.html', conversations_json=conversations_json)

def snowwhite5_04(request):
    print("snowwhite5_04")
    conversations_json = load_conversations("snowwhite5.json", "04")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_04.html', conversations_json=conversations_json)

def snowwhite5_05(request):
    print("snowwhite5_05")
    conversations_json = load_conversations("snowwhite5.json", "05")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_05.html', conversations_json=conversations_json)

def snowwhite5_06(request):
    print("snowwhite5_06")
    conversations_json = load_conversations("snowwhite5.json", "06")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_06.html', conversations_json=conversations_json)

def snowwhite5_07(request):
    print("snowwhite5_07")
    conversations_json = load_conversations("snowwhite5.json", "07")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_07.html', conversations_json=conversations_json)

def snowwhite5_08(request):
    print("snowwhite5_08")
    conversations_json = load_conversations("snowwhite5.json", "08")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_08.html', conversations_json=conversations_json)

def snowwhite5_09(request):
    print("snowwhite5_09")
    conversations_json = load_conversations("snowwhite5.json", "09")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_09.html', conversations_json=conversations_json)

def snowwhite5_10(request):
    print("snowwhite5_10")
    conversations_json = load_conversations("snowwhite5.json", "10")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_10.html', conversations_json=conversations_json)

def snowwhite5_11(request):
    print("snowwhite5_11")
    conversations_json = load_conversations("snowwhite5.json", "11")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_11.html', conversations_json=conversations_json)
    
def snowwhite5_12(request):
    print("snowwhite5_12")
    conversations_json = load_conversations("snowwhite5.json", "12")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_12.html', conversations_json=conversations_json)

def snowwhite5_13(request):
    print("snowwhite5_13")
    conversations_json = load_conversations("snowwhite5.json", "13")
    return check_session(request=request, html= 'snowwhite5/snowwhite5_13.html', conversations_json=conversations_json)

#gpt 테스트용
def snowwhite_home_test(request):
    print("home")
    if request.method == 'POST': 
        print("home request")
        print(request)
        prompt = request.POST.get('prompt') 
        prompt=str(prompt)
        response = get_completion(prompt)
        return JsonResponse({'response': response}) 
    return render(request, 'snowwhite/snowwhite_home_test.html') 

#바드 테스트용
def snowwhite_title_test(request):
    print("title")
    if request.method == 'POST':
        print("title request") 
        print(request)
        prompt = request.POST.get('prompt') 
        prompt=str(prompt)
        bard = Bard(session=session, token = BARD_1PSID_TOKEN)
        response = bard.get_answer(prompt)
        print(response['content'])
        return JsonResponse({'response': response['content']}) 
    return render(request, 'snowwhite/snowwhite_title_test.html') 

    
    
    

