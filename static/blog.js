const BACKEND_URL = "/api";
const blog_wrapper = document.getElementById("blog_posts_wrapper")

const setBlogPosts = posts => {
    for (let i = 0; i < posts.length; ++i) {
        let blog_post = document.createElement("div");
        blog_post.className = "blog_post_wrapper";
        let post_data = posts[i];
        let post_title = document.createElement("h1");
        post_title.className = "blog_post_title";
        post_title.innerText = post_data.title;
        let post_body = document.createElement("p");
        post_body.className = "blog_post_body";
        post_body.innerText = post_data.body;
        let post_created = document.createElement("small");
        post_created.className = "blog_post_created";
        post_created.innerText = new Date(post_data.created * 1000).toLocaleDateString('en-us', {
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric"
        });
        blog_post.appendChild(post_title);
        blog_post.appendChild(post_created);
        blog_post.appendChild(post_body);
        blog_wrapper.appendChild(blog_post);
    }
}
blog_wrapper.innerText = "Loading...";
fetch(BACKEND_URL + "/posts/", {
    method: "GET"
})
    .then(res => res.json())
    .then(res => {
        blog_wrapper.innerText = "";
        setBlogPosts(res.reverse())
    })
    .catch(err => {
        console.log(err);
        blog_wrapper.innerText = "Couldn't fetch blog posts.";
    })