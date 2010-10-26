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

(defn upload [video-id] (insert! :videos {:_id video-id}) (response/redirect "/"))

(def index (html
            [:html
             [:head
              [:title "funnytube"]]
             [:body
              (form-to [:post "/upload"]
                       (text-field "v"))
              (unordered-list (map str (fetch :videos)))]]))

(defroutes main-routes
  (GET "/" [] index)
  (POST "/upload" {params :params} (upload (params "v")))
  (route/not-found "not found"))

(run-jetty main-routes {:port 8080})
