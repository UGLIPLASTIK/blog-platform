import { func, string } from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArticle, updateArticle, loading, newArticle, resetState, editing } from '../../store/editor-slice';
import { chosenArticle } from '../../store/article-slice';
import ValidationMessage from '../ValidationMessage';
import styles from './styles.module.scss';
const TagCreator = ({ addTagFn }) => {
  const [tag, setTag] = useState('');

  return (
    <div className={styles.tag}>
      <input
        placeholder="Tag"
        onChange={(e) => {
          setTag(e.target.value);
        }}
        value={tag}
        type="text"
      />
      <button type="button">Delete</button>
      <button
        id="add-tag-button"
        onClick={() => {
          if (tag.trim() === '') return;
          addTagFn((prev) => {
            if (prev.includes(tag)) return prev;
            return [...prev, tag];
          });
          setTag('');
        }}
        type="button"
      >
        Add tag
      </button>
    </div>
  );
};

const Tag = ({ tag, handleDeleteTag }) => {
  return (
    <div className={styles.tag}>
      <input disabled value={tag} type="text" />
      <button onClick={() => handleDeleteTag(tag)} type="button">
        Delete
      </button>
    </div>
  );
};

Tag.propTypes = { tag: string, handleDeleteTag: func.isRequired };
TagCreator.propTypes = { addTagFn: func.isRequired };

const CreateArticleForm = () => {
  const editedArticle = useSelector(chosenArticle);
  const loadingStatus = useSelector(loading);
  const newArticleStatus = useSelector(newArticle);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editStatus = useSelector(editing);
  const [tags, setTags] = useState(editStatus ? editedArticle.tagList : []);
  console.log(editStatus);

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  useEffect(() => {
    if (!newArticleStatus) return;
    navigate(`/articles/${newArticleStatus.article.slug}`);
    return () => {
      dispatch(resetState());
    };
  }, [newArticleStatus]);

  const onSubmit = () => {
    const requestBody = {
      article: {
        title: getValues('title'),
        description: getValues('description'),
        body: getValues('text'),
        tagList: tags,
      },
    };
    console.log(requestBody);
    if (editStatus) {
      console.log('onEdit');
      dispatch(updateArticle({ slug: editedArticle.slug, body: requestBody }));
    } else {
      console.log('onCreate');
      dispatch(createArticle(requestBody));
    }
  };

  const handleDeleteTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));
  const titleError = errors.title?.message;
  const descriptionError = errors.description?.message;
  const textError = errors.text?.message;

  const positionMessage = { translateY: '-18px' };
  if (loadingStatus) return <p>Loading...</p>;

  return (
    <div className={styles.creatingForm}>
      {!editStatus ? <h2>Create new article</h2> : <h2>Edit article</h2>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Title
          <input
            defaultValue={editStatus ? editedArticle.title : null}
            name="title"
            type="text"
            placeholder="Title"
            {...register('title', {
              required: 'This field is required',
            })}
          />
          {titleError && <ValidationMessage style={positionMessage} message={titleError} />}
        </label>
        <label>
          Short description
          <input
            defaultValue={editStatus ? editedArticle.description : null}
            name="description"
            type="text"
            placeholder="Description"
            {...register('description', {
              required: 'This field is required',
            })}
          />
          {descriptionError && <ValidationMessage style={positionMessage} message={descriptionError} />}
        </label>
        <label>
          Text
          <textarea
            defaultValue={editStatus ? editedArticle.body : null}
            name="text"
            placeholder="Text"
            {...register('text', {
              required: 'This field is required',
            })}
          />
          {textError && <ValidationMessage style={positionMessage} message={textError} />}
        </label>

        <div className={styles.tags}>
          <div>Tags</div>
          {tags.map((tag) => (
            <Tag key={tag} tag={tag} handleDeleteTag={handleDeleteTag} />
          ))}
          <TagCreator addTagFn={setTags} />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
