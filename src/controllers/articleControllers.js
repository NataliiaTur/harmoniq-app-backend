import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  patchArticle,
} from '../services/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getArticlesController = async (req, res) => {
  const articles = await getAllArticles();

  res.json({
    status: 200,
    message: 'Successfully found articles!',
    data: articles,
  });
};

export const getArticleByIdController = async (req, res) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);

  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};

export const createArticleController = async (req, res) => {
  const article = await createArticle(req.body, req.user.id);

    res.status(201).json({
      status: 201,
      message: 'Successfully created article',
      data: newArticle,
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};

export const patchArticleController = async (req, res) => {
  const { articleId } = req.params;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await patchArticle(articleId, {
    ...req.body,
    img: photoUrl, // ✅ URL як рядок (тільки якщо фото завантажено)
  });

  res.json({
    status: 200,
    message: 'Successfully patched an article',
    data: result,
  });
};

export const deleteArticleController = async (req, res) => {
  const { articleId } = req.params;
  await deleteArticle(articleId);

  res.status(204).send();
};
