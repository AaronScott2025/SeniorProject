from os import environ
from urllib import request
import openai
from supabase import create_client, Client
from flask import Flask, jsonify
from GameSpaceBackend.models.classes import Profile, DuoMatching
import GameSpaceBackend.services.MatchmakingService as ms

app = Flask(__name__)

SUPABASE_URL = "https://xfmccwekbxjkrjwuheyv.supabase.co"
SUPABASE_API_KEY = environ.get("SUPABASE")
OPEN_AI_KEY = environ.get("OPEN_AI")

supabase = create_client(SUPABASE_URL, SUPABASE_API_KEY)

@app.route('/mediaGet/', methods=['GET'])
def mediaGet():
    try:
        offset = int(request.args.get('offset', 0)) # Get the 'offset' parameter from the query string; default to 0 if not provided
        response = supabase.table('post').select('*').range(offset, offset + 24).execute() # Fetch 25 posts starting from the given offset (This will change later on)
        if response.data: # Check if data is present
            return jsonify({
                "posts": response.data,
                "next_offset": offset + 25  # Provide the next offset for subsequent calls
            }), 200
        else:
            return jsonify({"message": "No more posts available"}), 200 #No more posts

    except Exception as e:
        return jsonify({"error": str(e)}), 500 #Some Error


@app.route('/chatbot/', methods= ['POST'])
def chatbot(userinfo):
    try:
        user = Profile(userinfo.username,userinfo.bio,userinfo.favoritegames,userinfo.profilepicture,userinfo.followers) #User Dataclass
        input = request.get_json() #input
        message = input['message'] #message
        response = openai.ChatCompletion.create( #Create a response
            model = "gpt-4o", #Model
            messages = [ #System Message
                {"role": "system", "content": "You are a chatbot for a gaming social media page. You will be talking to "
                                              "a user with the following background:"
                                              f"Username: {user.Username} "
                                              f"Bio: {user.Bio} "
                                              f"FavoriteGames: {user.FavoriteGames} "
                                              f"Your job is to assist the user with anything they need" },
                {"role": "user", "content": message} #User Message
            ]
        )
        reply = response['choices'][0]['message']['content']
        return jsonify({"response": reply}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/matchmaker/', methods=['GET'])
def matchmaker():
    try:
        mminfo = request.args
        match = DuoMatching(
            mminfo.get('id'),
            mminfo.get('Username'),
            mminfo.get('Top5Games'),
            mminfo.get('PlayerType'),
            mminfo.get('PlayerTypeInts'),
            mminfo.get('Description')
        )
        listofallduos = ms.importSpecificProfiles(supabase, match)
        listofpotentialduos = ms.matchMaking(listofallduos, supabase, match)
        return jsonify(listofpotentialduos)  # Return the potential duos as JSON

    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)