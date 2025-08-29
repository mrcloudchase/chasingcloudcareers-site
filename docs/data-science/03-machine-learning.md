---
sidebar_position: 5
---

# Machine Learning

## Supervised Learning Fundamentals
- **What you Need to Know**
  - **Linear Models and Regression**
    - Simple and multiple linear regression
    - Logistic regression for classification
    - Regularization techniques (Ridge, Lasso, Elastic Net)
    - **Resources:**
      - [Linear Regression Tutorial](https://scikit-learn.org/stable/modules/linear_model.html) - Scikit-learn linear models
      - [Logistic Regression](https://machinelearningmastery.com/logistic-regression-for-machine-learning/) - Classification with logistic regression
      - [Regularization Guide](https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression) - Ridge and Lasso regression

  - **Tree-Based Methods**
    - Decision trees and tree construction algorithms
    - Random Forest and ensemble methods
    - Gradient boosting (XGBoost, LightGBM)
    - **Resources:**
      - [Decision Trees](https://scikit-learn.org/stable/modules/tree.html) - Decision tree algorithms
      - [Random Forest Guide](https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf) - Breiman's original random forest paper
      - [XGBoost Tutorial](https://xgboost.readthedocs.io/en/stable/tutorials/model.html) - Gradient boosting framework

  - **Instance-Based Learning**
    - K-Nearest Neighbors (KNN) algorithm
    - Distance metrics and similarity measures
    - Curse of dimensionality and feature selection
    - **Resources:**
      - [KNN Algorithm](https://scikit-learn.org/stable/modules/neighbors.html) - K-nearest neighbors implementation
      - [Distance Metrics](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise_distances.html) - Similarity and distance functions
      - [Feature Selection for KNN](https://machinelearningmastery.com/feature-selection-for-machine-learning/) - Feature selection techniques

## Unsupervised Learning Methods
- **What you Need to Know**
  - **Clustering Algorithms**
    - K-means clustering and centroid-based methods
    - Hierarchical clustering and dendrograms
    - Density-based clustering (DBSCAN, OPTICS)
    - **Resources:**
      - [Clustering Guide](https://scikit-learn.org/stable/modules/clustering.html) - Comprehensive clustering algorithms
      - [K-means Tutorial](https://realpython.com/k-means-clustering-python/) - K-means implementation in Python
      - [Hierarchical Clustering](https://joernhees.de/blog/2015/08/26/scipy-hierarchical-clustering-and-dendrogram-tutorial/) - Hierarchical clustering with SciPy

  - **Dimensionality Reduction**
    - Principal Component Analysis (PCA) implementation
    - t-SNE for visualization and non-linear reduction
    - Factor analysis and independent component analysis
    - **Resources:**
      - [PCA Tutorial](https://scikit-learn.org/stable/modules/decomposition.html#pca) - Principal component analysis
      - [t-SNE Guide](https://scikit-learn.org/stable/modules/manifold.html#t-sne) - t-distributed stochastic neighbor embedding
      - [Dimensionality Reduction Comparison](https://scikit-learn.org/stable/auto_examples/manifold/plot_compare_methods.html) - Comparison of reduction methods

  - **Association Rules and Market Basket Analysis**
    - Apriori algorithm and frequent itemsets
    - Association rule metrics (support, confidence, lift)
    - Market basket analysis applications
    - **Resources:**
      - [Association Rules](https://github.com/rasbt/mlxtend/blob/master/docs/sources/user_guide/frequent_patterns/apriori.ipynb) - Apriori algorithm implementation
      - [Market Basket Analysis](https://pbpython.com/market-basket-analysis.html) - Practical market basket analysis
      - [MLxtend Library](https://rasbt.github.io/mlxtend/) - Machine learning extensions

## Model Evaluation and Validation
- **What you Need to Know**
  - **Cross-Validation Techniques**
    - K-fold cross-validation and stratified sampling
    - Leave-one-out and bootstrap validation
    - Time series cross-validation for temporal data
    - **Resources:**
      - [Cross-Validation Guide](https://scikit-learn.org/stable/modules/cross_validation.html) - Model validation techniques
      - [Time Series CV](https://robjhyndman.com/hyndsight/tscv/) - Time series validation methods
      - [Bootstrap Methods](https://machinelearningmastery.com/a-gentle-introduction-to-the-bootstrap-method/) - Bootstrap validation

  - **Performance Metrics for Classification**
    - Accuracy, precision, recall, and F1-score
    - ROC curves and Area Under Curve (AUC)
    - Confusion matrices and classification reports
    - **Resources:**
      - [Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) - Classification evaluation guide
      - [ROC and AUC](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc) - Google's ROC tutorial
      - [Precision-Recall Curves](https://machinelearningmastery.com/roc-curves-and-precision-recall-curves-for-classification-in-python/) - Classification curve analysis

  - **Performance Metrics for Regression**
    - Mean Squared Error (MSE) and Root Mean Squared Error (RMSE)
    - Mean Absolute Error (MAE) and R-squared
    - Residual analysis and model diagnostics
    - **Resources:**
      - [Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics) - Regression evaluation methods
      - [Residual Analysis](https://online.stat.psu.edu/stat501/lesson/11) - Penn State residual diagnostics
      - [Model Diagnostics](https://www.statsmodels.org/stable/diagnostic.html) - Statistical model diagnostics

## Hyperparameter Tuning and Model Selection
- **What you Need to Know**
  - **Grid Search and Random Search**
    - Hyperparameter optimization strategies
    - Cross-validation for parameter selection
    - Computational efficiency and search space design
    - **Resources:**
      - [Hyperparameter Tuning](https://scikit-learn.org/stable/modules/grid_search.html) - Grid search and random search
      - [Parameter Optimization](https://machinelearningmastery.com/hyperparameter-optimization-with-random-search-and-grid-search/) - Optimization techniques
      - [Bayesian Optimization](https://github.com/fmfn/BayesianOptimization) - Advanced parameter optimization

  - **Model Comparison and Selection**
    - Bias-variance tradeoff analysis
    - Learning curves and validation curves
    - Statistical tests for model comparison
    - **Resources:**
      - [Model Selection](https://scikit-learn.org/stable/modules/learning_curve.html) - Learning and validation curves
      - [Bias-Variance Analysis](http://scott.fortmann-roe.com/docs/BiasVariance.html) - Bias-variance decomposition
      - [Model Comparison](https://machinelearningmastery.com/statistical-significance-tests-for-comparing-machine-learning-algorithms/) - Statistical model comparison

## Introduction to Deep Learning
- **What you Need to Know**
  - **Neural Network Fundamentals**
    - Perceptrons and multi-layer networks
    - Activation functions and backpropagation
    - Training neural networks with gradient descent
    - **Resources:**
      - [Neural Networks Course](https://www.coursera.org/learn/neural-networks-deep-learning) - Andrew Ng's deep learning course
      - [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/) - Free online neural networks book
      - [TensorFlow Beginner Tutorial](https://www.tensorflow.org/tutorials/quickstart/beginner) - Introduction to deep learning

  - **Deep Learning Frameworks**
    - TensorFlow and Keras for deep learning
    - PyTorch for research and experimentation
    - Model building and training workflows
    - **Resources:**
      - [TensorFlow Tutorials](https://www.tensorflow.org/tutorials) - Official TensorFlow learning resources
      - [PyTorch Tutorials](https://pytorch.org/tutorials/) - PyTorch framework tutorials
      - [Keras Documentation](https://keras.io/getting_started/) - High-level neural network API

  - **Deep Learning Applications**
    - Convolutional Neural Networks for image data
    - Recurrent Neural Networks for sequential data
    - Transfer learning and pre-trained models
    - **Resources:**
      - [CNN Tutorial](https://www.tensorflow.org/tutorials/images/cnn) - Convolutional neural networks
      - [RNN Tutorial](https://www.tensorflow.org/tutorials/text/rnn) - Recurrent neural networks
      - [Transfer Learning](https://www.tensorflow.org/tutorials/images/transfer_learning) - Using pre-trained models

## Time Series Analysis and Forecasting
- **What you Need to Know**
  - **Time Series Decomposition**
    - Trend, seasonal, and residual components
    - Additive vs multiplicative decomposition
    - Stationarity testing and transformation
    - **Resources:**
      - [Time Series Decomposition](https://otexts.com/fpp3/decomposition.html) - Forecasting book decomposition chapter
      - [Statsmodels Decomposition](https://www.statsmodels.org/stable/examples/notebooks/generated/decomposition.html) - Time series decomposition
      - [Time Series with Pandas](https://pandas.pydata.org/docs/user_guide/timeseries.html) - Time series functionality

  - **Forecasting Models**
    - ARIMA models and seasonal ARIMA
    - Exponential smoothing methods
    - Prophet for automated forecasting
    - **Resources:**
      - [ARIMA Modeling](https://www.statsmodels.org/stable/examples/notebooks/generated/tsa_arma_0.html) - ARIMA implementation
      - [Prophet Documentation](https://facebook.github.io/prophet/) - Facebook's forecasting tool
      - [Time Series Forecasting](https://machinelearningmastery.com/time-series-forecasting-methods-in-python-cheat-sheet/) - Forecasting methods comparison

**Ready to Visualize Insights?** Continue to [Module 4: Data Visualization](./04-data-visualization.md) to master data storytelling, visualization design, and communicating insights effectively.
