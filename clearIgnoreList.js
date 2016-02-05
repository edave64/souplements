/**
 * Deletes every entry on your ignore list. If your list is very long, it might take some time,
 * but it will reload the page if it is done.
 *
 * Use without template
 *
 * Licence: Public domain
 */
(function(){
    var ignore = document.getElementById("userlist_ignored");
    if (!ignore) {
        alert("No ignore list was found. Please make sure to run this script on http://www.soup.io/everyone.");
        return;
    }
    var nodes=ignore.querySelectorAll("input.btn[title=Remove][type=submit]");
    if(!nodes || nodes.length < 1){
        alert("No ignore list entries were found. Please make sure the list is expanded.");
        return;
    }
    var confirmation = confirm(
        "Do you really want remove all " + nodes.length
        + " ignored users from your list? This could take a while. The page will reload automatically!"
    );
    if(!confirmation) return;

    var parent=document.getElementById("friends");
    var data=Form.serialize(parent).replace("relation_type=friend","relation_type=ignore");
    function chainOfRequests(i) {
        var node = nodes[i];
        if(!node){
            location.reload()
        }
        var myData = data.replace("relation_id=","relation_id=" + node.getAttribute('onclick').match(/this, (\d+), 'ignore'/)[1]);
        new Ajax.Request(
            parent.action,
            {
                evalScripts:!0,
                parameters:myData,
                onSuccess:function(){
                    chainOfRequests(++i);
                    console.log(i+"/"+nodes.length);
                }
            }
        );
    }
    chainOfRequests(0);
}());