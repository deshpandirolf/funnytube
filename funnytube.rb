include Mongo

class FunnyTube

  class << self
    def coll
      @@coll ||= Connection.new.db('funnytube').collection('videos')
    end

    def update_score(id, delta)
      coll.update({ :_id => id }, {"$inc" => delta})
    end

    def upvote(id)
      update_score(id, 1)
    end

    def downvote(id)
      update_score(id, -1)
    end

    def id_for_url(url)
      url[/youtube\.com.*\?v=(\w+)/] || url[/youtube\.com\/v\/(\w+)/]
    end

    def top_videos
      coll.find({}, :limit => 10, :sort => [[:score, :desc]])
    end
  end
end

set :views, File.dirname(__FILE__) + '/templates'

post '/submit' do
  video_id = params[:v]
  @coll.save({:_id => video_id, :score => 0})
  redirect '/'
end

get '/' do
  @videos = FunnyTube.top_videos
  erb :index
end
