import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chosenArticle, fetchArticle, loading } from '../../store/article-slice';
import ArticlePreview from '../ArticlePreview';
import styles from './styles.module.scss';
import { user } from '../../store/auth-slice';

const Article = () => {
  const currentArticle = useSelector(chosenArticle);
  const onLoad = useSelector(loading);
  const userData = useSelector(user);
  const dispatch = useDispatch();
  const { slug } = useParams();
  useEffect(() => {
    dispatch(fetchArticle(slug));
  }, []);

  if (onLoad) return <div className={styles.loader}>Loading...</div>;

  if (!currentArticle) return;
  const { body } = currentArticle;

  return (
    <div className={styles.article}>
      <ArticlePreview article={currentArticle} body={body} user={userData} />
    </div>
  );
};

export default Article;
