import React from 'react'
import Helmet from 'react-helmet'
import { config } from 'config'

import SitePost from '../components/SitePost';
import SitePage from '../components/SitePage';

module.exports = React.createClass({
  propTypes () {
    return {
      router: React.PropTypes.object,
    }
  },
  render () {
    const post = this.props.route.page.data
    const layout = post.layout;
    let template;

    if (layout !== 'page') {
      template = <SitePost {...this.props} />;
    } else {
      template = <SitePage {...this.props} />;
    }

    return (
      <div>
        <Helmet>
          <title>{`${post.title} - ${config.siteTitle}`}</title>
          {post.description && <meta name="description" content={post.description} />}
        </Helmet>
        {template}
      </div>
    )
  },
})
