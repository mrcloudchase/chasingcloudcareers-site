---
sidebar_position: 3
---

# ML Fundamentals

## Mathematical Foundations for Machine Learning
- **What you Need to Know**
  - **Linear Algebra in Machine Learning**
    - Vector spaces and linear transformations in ML contexts
    - Matrix operations for data representation and model parameters
    - Eigendecomposition and Singular Value Decomposition (SVD)
    - **Resources:**
      - [Linear Algebra for ML](https://github.com/fastai/numerical-linear-algebra) - Fast.ai computational linear algebra course
      - [Matrix Calculus for Deep Learning](https://explained.ai/matrix-calculus/) - Matrix derivatives and gradients
      - [Linear Algebra Review - CS229](https://cs229.stanford.edu/section/cs229-linalg.pdf) - Stanford ML linear algebra notes

  - **Calculus and Optimization Theory**
    - Gradient computation and chain rule for backpropagation
    - Convex optimization and global vs local minima
    - Lagrange multipliers and constrained optimization
    - **Resources:**
      - [Convex Optimization - Boyd](https://web.stanford.edu/~boyd/cvxbook/) - Free convex optimization textbook
      - [Optimization for Machine Learning](https://arxiv.org/abs/1909.03550) - Modern optimization techniques
      - [Calculus on Computational Graphs](https://colah.github.io/posts/2015-08-Backprop/) - Backpropagation explained

  - **Probability Theory and Statistical Learning**
    - Bayesian inference and maximum likelihood estimation
    - Probability distributions and their ML applications
    - Information theory and entropy in machine learning
    - **Resources:**
      - [Probabilistic Machine Learning](https://probml.github.io/pml-book/) - Kevin Murphy's comprehensive ML book
      - [Information Theory - MacKay](http://www.inference.org.uk/itprnn/book.pdf) - Information theory and inference
      - [Bayesian Methods for Machine Learning](https://www.coursera.org/learn/bayesian-methods-in-machine-learning) - HSE University course

## Supervised Learning Algorithms
- **What you Need to Know**
  - **Linear Models and Regularization**
    - Linear regression with mathematical derivation
    - Ridge, Lasso, and Elastic Net regularization
    - Logistic regression and maximum likelihood
    - **Resources:**
      - [Linear Models - ESL](https://hastie.su.domains/ElemStatLearn/printings/ESLII_print12_toc.pdf) - Elements of Statistical Learning chapters
      - [Regularization Tutorial](https://machinelearningmastery.com/regularization-for-reducing-generalization-error/) - Ridge and Lasso implementation
      - [Logistic Regression Math](https://ml-cheatsheet.readthedocs.io/en/latest/logistic_regression.html) - Mathematical foundations

  - **Tree-Based Methods and Ensemble Learning**
    - Decision trees and information gain criteria
    - Random Forest and bagging techniques
    - Gradient boosting and XGBoost implementation
    - **Resources:**
      - [Decision Trees - Scikit-learn](https://scikit-learn.org/stable/modules/tree.html) - Decision tree algorithms and implementation
      - [Random Forest Paper](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) - Breiman's original random forest paper
      - [XGBoost Documentation](https://xgboost.readthedocs.io/en/stable/) - Gradient boosting framework

  - **Support Vector Machines and Kernel Methods**
    - SVM optimization problem and dual formulation
    - Kernel trick and non-linear transformations
    - Soft margin and regularization in SVMs
    - **Resources:**
      - [SVM Tutorial](https://web.mit.edu/6.034/wwwbob/svm-notes-long-08.pdf) - MIT SVM mathematical foundations
      - [Kernel Methods](https://alex.smola.org/drafts/thebook.pdf) - Learning with Kernels textbook
      - [SVM Implementation](https://scikit-learn.org/stable/modules/svm.html) - Scikit-learn SVM guide

## Unsupervised Learning and Dimensionality Reduction
- **What you Need to Know**
  - **Clustering Algorithms**
    - K-means clustering and expectation-maximization
    - Hierarchical clustering and linkage criteria
    - DBSCAN and density-based clustering
    - **Resources:**
      - [Clustering Algorithms](https://scikit-learn.org/stable/modules/clustering.html) - Comprehensive clustering guide
      - [K-means Mathematical Analysis](https://www.cs.cmu.edu/~mgormley/courses/10701-f16/slides/lecture14-em.pdf) - CMU clustering lecture
      - [DBSCAN Paper](https://www.aaai.org/Papers/KDD/1996/KDD96-037.pdf) - Original DBSCAN algorithm

  - **Principal Component Analysis and Matrix Factorization**
    - PCA mathematical derivation and implementation
    - Singular Value Decomposition applications
    - Non-negative Matrix Factorization (NMF)
    - **Resources:**
      - [PCA Tutorial](https://arxiv.org/abs/1404.1100) - Principal Component Analysis explained
      - [SVD and PCA](https://web.mit.edu/be.400/www/SVD/Singular_Value_Decomposition.htm) - MIT SVD tutorial
      - [Matrix Factorization](https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf) - Netflix recommendation system

  - **Manifold Learning and Non-linear Dimensionality Reduction**
    - t-SNE for visualization and clustering
    - UMAP for dimensionality reduction
    - Autoencoders for non-linear feature learning
    - **Resources:**
      - [t-SNE Paper](https://jmlr.org/papers/v9/vandermaaten08a.html) - Original t-SNE algorithm
      - [UMAP Documentation](https://umap-learn.readthedocs.io/en/latest/) - Uniform Manifold Approximation
      - [Autoencoder Tutorial](https://blog.keras.io/building-autoencoders-in-keras.html) - Keras autoencoder implementation

## Deep Learning Fundamentals
- **What you Need to Know**
  - **Neural Network Architecture and Training**
    - Multi-layer perceptrons and universal approximation theorem
    - Backpropagation algorithm mathematical derivation
    - Gradient descent variants and optimization techniques
    - **Resources:**
      - [Deep Learning Book](https://www.deeplearningbook.org/) - Goodfellow, Bengio, and Courville comprehensive text
      - [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) - Nielsen's online book
      - [Backpropagation Calculus](https://www.youtube.com/watch?v=tIeHLnjs5U8) - 3Blue1Brown backprop explanation

  - **Convolutional Neural Networks**
    - Convolution operation and feature maps
    - CNN architectures (LeNet, AlexNet, VGG, ResNet)
    - Pooling layers and spatial hierarchies
    - **Resources:**
      - [CNN for Visual Recognition](https://cs231n.github.io/convolutional-networks/) - Stanford CS231n CNN guide
      - [CNN Architectures](https://arxiv.org/abs/1605.07678) - Survey of CNN architectures
      - [ResNet Paper](https://arxiv.org/abs/1512.03385) - Deep residual learning

  - **Recurrent Neural Networks and Sequence Modeling**
    - RNN architecture and vanishing gradient problem
    - LSTM and GRU for long-term dependencies
    - Attention mechanisms and Transformer architecture
    - **Resources:**
      - [Understanding LSTMs](https://colah.github.io/posts/2015-08-Understanding-LSTMs/) - LSTM architecture explained
      - [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original Transformer paper
      - [RNN Tutorial](https://karpathy.github.io/2015/05/21/rnn-effectiveness/) - Karpathy's RNN guide

## Model Selection and Validation
- **What you Need to Know**
  - **Cross-Validation Techniques**
    - K-fold cross-validation and stratified sampling
    - Leave-one-out and bootstrap validation
    - Time series cross-validation for temporal data
    - **Resources:**
      - [Cross-Validation](https://scikit-learn.org/stable/modules/cross_validation.html) - Scikit-learn CV documentation
      - [Model Selection](https://web.stanford.edu/~hastie/Papers/ESLII.pdf) - ESL model assessment chapter
      - [Time Series CV](https://robjhyndman.com/hyndsight/tscv/) - Time series validation techniques

  - **Bias-Variance Tradeoff and Regularization**
    - Mathematical analysis of bias-variance decomposition
    - Regularization techniques and their effects
    - Early stopping and dropout as regularization
    - **Resources:**
      - [Bias-Variance Tradeoff](http://scott.fortmann-roe.com/docs/BiasVariance.html) - Visual bias-variance explanation
      - [Regularization in Deep Learning](https://arxiv.org/abs/1701.05369) - Comprehensive regularization survey
      - [Dropout Paper](https://jmlr.org/papers/v15/srivastava14a.html) - Original dropout technique

  - **Hyperparameter Optimization**
    - Grid search and random search strategies
    - Bayesian optimization and Gaussian processes
    - Automated hyperparameter tuning techniques
    - **Resources:**
      - [Hyperparameter Optimization](https://arxiv.org/abs/1206.2944) - Bergstra and Bengio survey
      - [Bayesian Optimization](https://arxiv.org/abs/1012.2599) - Gaussian process optimization
      - [Optuna Tutorial](https://optuna.readthedocs.io/en/stable/tutorial/index.html) - Automated hyperparameter optimization

## Feature Engineering and Selection
- **What you Need to Know**
  - **Feature Extraction and Transformation**
    - Polynomial features and interaction terms
    - Feature scaling and normalization techniques
    - Handling categorical variables and encoding
    - **Resources:**
      - [Feature Engineering](https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/) - O'Reilly feature engineering book
      - [Preprocessing Data](https://scikit-learn.org/stable/modules/preprocessing.html) - Scikit-learn preprocessing guide
      - [Categorical Encoding](https://contrib.scikit-learn.org/category_encoders/) - Advanced categorical encoding techniques

  - **Feature Selection Methods**
    - Filter methods (correlation, mutual information)
    - Wrapper methods (recursive feature elimination)
    - Embedded methods (Lasso, tree-based importance)
    - **Resources:**
      - [Feature Selection](https://scikit-learn.org/stable/modules/feature_selection.html) - Comprehensive feature selection guide
      - [Information Theory Feature Selection](https://arxiv.org/abs/1106.2418) - Mutual information methods
      - [Recursive Feature Elimination](https://machinelearningmastery.com/rfe-feature-selection-in-python/) - RFE implementation

## Evaluation Metrics and Performance Analysis
- **What you Need to Know**
  - **Classification Metrics**
    - Accuracy, precision, recall, and F1-score analysis
    - ROC curves and Area Under Curve (AUC)
    - Multi-class and multi-label evaluation metrics
    - **Resources:**
      - [Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) - Comprehensive metrics guide
      - [ROC and AUC Explained](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc) - Google's ROC tutorial
      - [Multi-class Metrics](https://arxiv.org/abs/2008.05756) - Multi-class evaluation survey

  - **Regression Metrics**
    - Mean Squared Error (MSE) and Root Mean Squared Error (RMSE)
    - Mean Absolute Error (MAE) and robust metrics
    - R-squared and adjusted R-squared interpretation
    - **Resources:**
      - [Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics) - Regression evaluation guide
      - [Understanding R-squared](https://blog.minitab.com/en/adventures-in-statistics-2/regression-analysis-how-do-i-interpret-r-squared-and-assess-the-goodness-of-fit) - R-squared interpretation
      - [Robust Regression Metrics](https://arxiv.org/abs/1608.06048) - Alternative regression metrics

## Algorithm Implementation from Scratch
- **What you Need to Know**
  - **Linear Algebra Implementation**
    - Matrix operations without NumPy dependencies
    - Gradient computation and optimization loops
    - Numerical stability and computational efficiency
    - **Resources:**
      - [ML Algorithms from Scratch](https://github.com/rushter/MLAlgorithms) - Pure Python implementations
      - [Numerical Linear Algebra](https://github.com/fastai/numerical-linear-algebra) - Computational linear algebra course
      - [Matrix Cookbook](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf) - Matrix identities and derivatives

  - **Optimization Algorithm Implementation**
    - Gradient descent variants (SGD, Adam, RMSprop)
    - Newton's method and quasi-Newton methods
    - Coordinate descent and proximal methods
    - **Resources:**
      - [Optimization Algorithms](https://arxiv.org/abs/1609.04747) - Overview of optimization for deep learning
      - [SGD Variants](https://ruder.io/optimizing-gradient-descent/) - Gradient descent optimization overview
      - [Proximal Algorithms](https://web.stanford.edu/~boyd/papers/pdf/prox_algs.pdf) - Proximal optimization methods

**Ready to Engineer Data?** Continue to [Module 2: Data Engineering](./02-data-engineering.md) to master data pipelines, preprocessing, and feature engineering for machine learning systems.
