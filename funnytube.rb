require "rubygems"
require "bundler/setup"
require 'youtube_g'
require 'mongo'
require 'sinatra'

include Mongo

class FunnyTube

  class << self
    def coll
      @@coll ||= Connection.new.db('funnytube').collection('videos')
    end

    def youtube
      @@youtube ||= YouTubeG::Client.new
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
      md = url.match(/youtube\.com.*\?v=([\w-]+)/)
      md ||= url.match(/youtube\.com\/v\/([\w-]+)/)

      begin
        md[1]
      rescue
        raise "ERROR: Could not parse youtube video URL."
      end
    end

    def top_videos
      coll.find({}, :limit => 10, :sort => [[:score, :desc]])
    end
  end
end

set :views, File.dirname(__FILE__) + '/templates'
set :public, File.dirname(__FILE__) + '/static'

before do
  if request.cookies["u"].nil?
    response.set_cookie('u', Digest::MD5.hexdigest(Time.now.to_i.to_s + request.referer))
  end
end

post '/submit' do
  video_id = FunnyTube.id_for_url(params[:v])
  title = FunnyTube.youtube.video_by(video_id).title
  FunnyTube.coll.save({:_id => video_id, 
                      :user_id => request.cookies["u"],
                      :title => title,
                      :score => 0})
  redirect '/'
end

get '/' do
  @videos = FunnyTube.top_videos
  erb :index
end
