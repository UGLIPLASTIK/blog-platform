import { Popconfirm } from 'antd';
import { format } from 'date-fns';
import PropTypes, { arrayOf, bool, number, object, string } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/avatar_default.png';
import { deleteArticle, toggleFavoriteArticle } from '../../store/article-slice';
import { startEdit } from '../../store/editor-slice';
import styles from './styles.module.scss';

const ArticlePreview = ({ article, user, body = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { title, description, author, updatedAt, tagList = [], favoritesCount, favorited, slug } = article;
  const [like, setLike] = useState(favorited);
  const [count, setCount] = useState(favoritesCount);
  const date = format(updatedAt, 'MMMM d, yyyy');
  const owner = user?.username === author.username;
  const likeRef = useRef(like);

  useEffect(() => {
    likeRef.current = like;
  }, [like]);

  useEffect(() => {
    return () => {
      if (likeRef.current !== favorited) {
        dispatch(toggleFavoriteArticle({ slug: slug, favorited: likeRef.current }));
      }
    };
  }, []);

  return (
    <div className={styles.articlePreview}>
      <div className={styles.articlePreview__info}>
        <div className={styles.articlePreview__text}>
          <span className={styles.name}>{author.username}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <img src={author.image} onError={(e) => (e.target.src = avatar)} alt="avatar" />
        <div className={owner && body ? styles.editBtns : styles.hidden}>
          <Popconfirm
            placement="left"
            title="Are you sure to delete this task?"
            description="Delete the task"
            okText="Yes"
            cancelText="No"
            onCancel={() => null}
            onConfirm={() => {
              dispatch(deleteArticle(slug));
              navigate('/');
            }}
          >
            <button className={styles.deleteBtn}>Delete</button>
          </Popconfirm>
          <button
            onClick={() => {
              dispatch(startEdit());
              navigate('/new-article');
            }}
            className={styles.editBtn}
          >
            Edit
          </button>
        </div>
      </div>

      <div className={styles.articlePreview__titleGroup}>
        <h3>{title}</h3>
        <div>
          <div
            onClick={() => {
              setLike(!like);
              setCount(like ? count - 1 : count + 1);
            }}
            className={!like ? styles.iconLike : styles.iconLiked}
          ></div>
          <span>{count}</span>
        </div>
      </div>

      <div className={styles.articlePreview__tags}>
        {tagList?.map((tag, i) => {
          if (tag.length != 0) {
            return <span key={i}>{tag}</span>;
          } else return null;
        })}
      </div>
      <p className={!body ? styles.description : styles.descriptionInFull}>{description}</p>
      <div className={styles.textBody} hidden={!body}>
        <Markdown>{body}</Markdown>
      </div>
    </div>
  );
};

ArticlePreview.propTypes = {
  article: PropTypes.shape({
    title: string.isRequired,
    description: string.isRequired,
    author: object,
    updatedAt: string,
    tagList: arrayOf(string),
    favoritesCount: number,
    slug: string,
    favorited: bool,
  }),
  body: string,
  user: object,
};
export default ArticlePreview;
