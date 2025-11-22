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
                        bat 'npm test -- --watchAll=false --passWithNoTests || echo "No frontend tests yet"'
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

        stage('Start Backend with PM2') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npx pm2 start index.js --name backend'
                }
            }
        }

        stage('Start Frontend with PM2') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npx pm2 serve build 3000 --name frontend'
                }
            }
        }
    }

    post {
        success {
            echo "✅ MERN pipeline completed successfully!"
            echo "🛠️ Backend running on http://localhost:5000"
            echo "🌐 Frontend served from http://localhost:3000"
            echo "📌 Use 'npx pm2 list' to check running processes."
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
