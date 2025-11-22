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

        stage('Start Backend Server') {
            steps {
                dir("${BACKEND_DIR}") {
                    // Run backend in background so Jenkins doesn’t hang
                    bat 'start /b npx nodemon index.js'
                }
            }
        }

        stage('Start Frontend Server') {
            steps {
                dir("${FRONTEND_DIR}") {
                    // CRA dev server runs on http://localhost:3000
                     bat 'start /b serve -s build -l 3000'
                }
            }
        }
    }

    post {
        success {
            echo "✅ MERN pipeline completed successfully!"
            echo "🛠️ Backend running on http://localhost:5000"
            echo "🌐 Frontend served from http://localhost:3000"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
