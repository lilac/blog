import React from 'react';
import { Link } from 'react-router';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import Helmet from 'react-helmet';
import { prefixLink } from 'gatsby-helpers';
import access from 'safe-access';
import { config } from 'config';
import SiteSidebar from '../components/SiteSidebar';

import 'moment/locale/zh-hk';
// var locale = window.navigator.userLanguage || window.navigator.language;
var locale = "zh-hk";
moment.locale(locale);

class SiteIndex extends React.Component {
  render() {
    const pageLinks = [];
    // Sort pages.
    const sortedPages = sortBy(this.props.route.pages, page => access(page, 'data.date')).reverse();
    sortedPages.forEach((page) => {
      if (access(page, 'data.layout') === 'post') {
        const title = access(page, 'data.title') || page.path;
        const description = access(page, 'data.description');
        const datePublished = access(page, 'data.date');
        const category = access(page, 'data.category');

        pageLinks.push((
          <div className="blog-post" key={title}>
            <time dateTime={moment(datePublished).format('l')}>
              {moment(datePublished).format('l')}
            </time>
            <span style={{ padding: '5px' }} />
            <span className="blog-category">{category}</span>
            <h2><Link style={{ borderBottom: 'none' }} to={prefixLink(page.path)}>{title}</Link></h2>
            <p dangerouslySetInnerHTML={{ __html: description }} />
            <Link className="readmore" to={prefixLink(page.path)}>閱讀</Link>
          </div>
        ));
      }
    });

    return (
      <div>
        <Helmet title={config.siteTitle} />
        <SiteSidebar {...this.props} />
        <div className="content">
          <div className="main">
            <div className="main-inner">
              {pageLinks}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SiteIndex.propTypes = {
  route: React.PropTypes.object,
};

export default SiteIndex;
