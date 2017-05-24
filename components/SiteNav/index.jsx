import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import './style.css';

class SiteNav extends React.Component {
  render() {
    return (
      <nav className="blog-nav">
        <ul>
          <li>
            <Link to={prefixLink('/')} activeClassName="current" onlyActiveOnIndex> 文章
            </Link>
          </li>
          <li>
            <Link to={prefixLink('/IconStudio/')} activeClassName="current" target="_blank">圖標工作室</Link>
          </li>
          <li>
            <Link to={prefixLink('/about/')} activeClassName="current">關於
            </Link>
          </li>
          <li>
            <Link to={prefixLink('/contact/')} activeClassName="current">聯絡
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default SiteNav;
