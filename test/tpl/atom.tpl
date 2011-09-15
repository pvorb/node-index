<% for (var i = 0; i < __docs.length; i++) { %>
<%= __docs[i]._id %>
<%= esc(__docs[i].__content) %>
<% } %>
