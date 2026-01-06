import { useBlog } from '../../context/DataContext';

const BlogSection = () => {
  const blog = useBlog();

  if (!blog) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <article className="animate-fade-in">
      {/* Title */}
      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>

      {/* Blog Posts Grid */}
      <section className="mb-[10px]">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blog.posts?.map((post) => (
            <li key={post.id}>
              <a href="#" className="blog-card block">
                {/* Banner */}
                <figure className="blog-banner w-full h-[200px] md:h-auto rounded-xl overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    loading="lazy"
                  />
                </figure>

                {/* Content */}
                <div className="p-4">
                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-[10px]">
                    <p className="text-light-gray/70 text-sm font-light">{post.category}</p>
                    <span className="w-1 h-1 rounded-full bg-light-gray/70" />
                    <time className="text-light-gray/70 text-sm font-light">
                      {formatDate(post.date)}
                    </time>
                  </div>

                  {/* Title */}
                  <h3 className="blog-title h3 mb-[10px] leading-tight transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-light-gray text-sm font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default BlogSection;
