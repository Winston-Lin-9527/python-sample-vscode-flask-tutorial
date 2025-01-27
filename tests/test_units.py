from src.webapp import app

def test_mock():
  assert True
  
def test_index_route():
  response = app.test_client().get('/')
  assert response.status_code == 200
  # assert response.data == b'Hello, World!'

def test_about_route():
  response = app.test_client().get('/about/')
  assert response.status_code == 200
  
def test_contact_route():
  response = app.test_client().get('/contact/')
  assert response.status_code == 200
  
def test_send_note_route():
  response = app.test_client().post('/send_note', 
    json={
      'data': 
      {
        "content": "test content", 
        "author": "test author",
        "pastename": "test pastename"
      }})
  assert response.status_code == 200
  
  testNoteUUID = response.json['uuid']
  
  response = app.test_client().post('search_note', json={'note_uuid': testNoteUUID}) 

  assert response.status_code == 200
  assert response.json['status'] == 'ok'
  assert response.json['data']['data']['content'] == 'test content'
  assert response.json['data']['data']['author'] == 'test author'
