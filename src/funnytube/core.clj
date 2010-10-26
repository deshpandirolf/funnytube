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

(defn id-for-url [url]
  (nth (or (re-find #"youtube\.com.*\?v=(\w+)" url)
           (re-find #"youtube\.com/v/(\w+)" url)) 1))

(defn submit [url]
  (insert! :videos {:_id (id-for-url url)})
  (response/redirect "/"))

(def index (html
            [:html
             [:head
              [:title "funnytube"]]
             [:body
              (form-to [:post "/submit"]
                       (text-field "v"))
              (unordered-list (map str (fetch :videos)))]]))

(defroutes main-routes
  (GET "/" [] index)
  (POST "/submit" {params :params} (submit (params "v")))
  (route/not-found "not found"))

(run-jetty main-routes {:port 8080})
