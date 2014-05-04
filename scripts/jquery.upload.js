/**
 * @author Cobi Carmel
 */

!function(a){a.fn.upload=function(t,n){return n||(n={}),n.data=new FormData(this[0]),n.cache=!1,n.contentType=!1,n.type='post',n.processData=!1,n.xhr=function(){var t=a.ajaxSettings.xhr();return t.upload&&t.upload.addEventListener("progress",n.progress,!1)||t},a.ajax(t,n),this}}(jQuery);