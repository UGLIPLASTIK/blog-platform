import { Route, Routes } from 'react-router-dom';
import Article from '../Article';
import ArticleList from '../ArticleList';
import CreateArticleForm from '../CreateArticleForm';
import EditProfileForm from '../EditProfileForm';
import { Layout } from '../Layout/Layout';
import LoginForm from '../LoginForm';
import NotFoundPage from '../NotFoundPage';
import RegistrationForm from '../RegistrationForm';
import styles from './styles.module.scss';

function App() {
  return (
    <>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ArticleList />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/new-article" element={<CreateArticleForm />} />
            <Route path="/articles/:slug" element={<Article />} />
            <Route path="/sign-up" element={<RegistrationForm />} />
            <Route path="/sign-in" element={<LoginForm />} />
            <Route path="/profile-editor" element={<EditProfileForm />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
