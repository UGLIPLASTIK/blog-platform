import { Pagination } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { articles, changePage, fetchArticles, pagination } from '../../store/article-slice';
import ArticlePreview from '../ArticlePreview';
import styles from './styles.module.scss';
import { user } from '../../store/auth-slice.js';

const ArticleList = () => {
  const dispatch = useDispatch();
  const paginationSettings = useSelector(pagination);
  const userState = useSelector(user);
  console.log(userState);

  useEffect(() => {
    dispatch(fetchArticles(paginationSettings.offset));
  }, [paginationSettings]);
  const currentArticles = useSelector(articles);

  return (
    <div className={styles.articleList}>
      <div>
        {currentArticles.map((article) => (
          <Link to={`/articles/${article.slug}`} key={article.slug}>
            <ArticlePreview article={article} />
          </Link>
        ))}
      </div>

      <Pagination
        onChange={(page) => {
          dispatch(changePage(page));
        }}
        current={paginationSettings.currentPage}
        align="center"
        showSizeChanger={false}
        defaultCurrent={1}
        total={paginationSettings.total}
        defaultPageSize={5}
      />
    </div>
  );
};

export default ArticleList;
