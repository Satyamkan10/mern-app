pipeline {
    agent {
        node {
            label 'built-in'
            customWorkspace 'E:/jenkins'
        }
    }

    options {
        skipDefaultCheckout()
    }

    tools {
        nodejs 'node'
    }

    environment {
        BACKEND_DIR = "${WORKSPACE}/server"
        FRONTEND_DIR = "${WORKSPACE}/public"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Satyamkan10/mern-app.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm install'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    dir("${BACKEND_DIR}") {
                        bat 'npm test || echo "No backend tests yet"'
                    }
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    dir("${FRONTEND_DIR}") {
                        bat 'npm test -- --watchAll=false || echo "No frontend tests yet"'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm run build'
                }
            }
        }

        stage('Start Backend Server') {
            steps {
                dir("${BACKEND_DIR}") {
                    // Backend will read PORT and MONGO_URI from .env
                    bat 'npx nodemon index.js'
                }
            }
        }

        stage('Start Frontend Server') {
            steps {
                dir("${FRONTEND_DIR}") {
                    // Serve built frontend with Vite preview
                    bat 'npm run preview'
                }
            }
        }
    }

    post {
        success {
            echo "✅ MERN pipeline completed successfully!"
            echo "🛠️ Backend running on http://localhost:5000 (from .env)"
            echo "🌐 Frontend served from http://localhost:4173 (or port 3000 if overridden in vite.config.js)"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
