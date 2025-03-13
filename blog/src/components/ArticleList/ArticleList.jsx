import { Pagination } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { articles, changePage, fetchArticles, pagination } from '../../store/article-slice';
import ArticlePreview from '../ArticlePreview';
import styles from './styles.module.scss';

const ArticleList = () => {
  const dispatch = useDispatch();
  const paginationSettings = useSelector(pagination);

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
