(ns funnytube.core
  (:use compojure.core
        hiccup.core
        hiccup.form-helpers
        hiccup.page-helpers
        ring.adapter.jetty
        somnium.congomongo)
  (:require [compojure.route :as route]
            [ring.util.response :as response]))

(mongo! :db "funnytube")

(defn update-score [id delta]
  (let [video (fetch-one :videos :where {:_id id})]
    (update! :videos video (merge video { :score (+ delta (:score video)) })))
  (response/redirect "/"))

(defn upvote [id] (update-score id 1))
(defn downvote [id] (update-score id -1))

(defn id-for-url [url]
  (nth (or (re-find #"youtube\.com.*\?v=(\w+)" url)
           (re-find #"youtube\.com/v/(\w+)" url)) 1))

(defn submit [url]
  (insert! :videos {:_id (id-for-url url) :score 0})
  (response/redirect "/"))

(defn render-video [key]
  (let [link (str "http://www.youtube.com/v/" key "?fs=1&amp;hl=en_US")]
    [:object
     {:width 480 :height 385}
     [:param
      {:name "movie"
       :value link}
      ]
     [:param
      {:name "allowscriptaccess"
       :value "always"}
      ]
     [:embed
      {:src link
       :type "application/x-shockwave-flash"
       :allowscriptaccess "always"
       :allowfullscreen "true"
       :width 480
       :height 385
       }]]))

(defn index [req]
  (html
   [:html
    [:head
     [:title "funnytube"]
     (include-css "/static/css/main.css")]
    [:body
     (form-to [:post "/submit"]
              (text-field "v"))
     (unordered-list (map render-video (map :_id (fetch :videos))))]]))

(defroutes main-routes
  (GET "/" [] index)
  (POST "/downvote" {params :params} (upvote (params "id")))
  (POST "/upvote" {params :params} (upvote (params "id")))
  (POST "/submit" {params :params} (submit (params "v")))
  (route/files "/static" {:root "static"})
  (route/not-found "not found"))

(defn start []
  (run-jetty main-routes {:port 8080})
)
