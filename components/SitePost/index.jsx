import React from 'react';
import ReactDisqusThread from 'react-disqus-thread';
import moment from 'moment';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import { config } from 'config';
import ReadNext from '../ReadNext';
import './style.css';
import '../../static/css/highlight.css';

class SitePost extends React.Component {
  render() {
    const { route } = this.props;
    const post = route.page.data;
    const home = (
      <div>
        <Link className="gohome" to={prefixLink('/')}>全部文章</Link>
      </div>
    );

    return (
      <div>
        {home}
        <div className="blog-single">
          <div className="text">
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
            <div className="date-published">
              <em>發表於{moment(post.date).format('l')}</em>
            </div>
          </div>
          <ReactDisqusThread
				    shortname="jianmo"
    				identifier={route.page.path}
    				url={prefixLink(route.path)} />
          <div className="footer">
            <ReadNext post={post} {...this.props} />
            <hr />
            <p>
              {config.siteDescr}
              <a href={config.siteTwitterUrl}>
                <br /> <strong>{config.siteAuthor}</strong> on Twitter
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

SitePost.propTypes = {
  route: React.PropTypes.object.isRequired,
};

export default SitePost;
