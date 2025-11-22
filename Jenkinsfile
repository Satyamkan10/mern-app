pipeline {
    agent {
        node {
            label 'built-in'
            customWorkspace 'E:/jenkins'
        }
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

        stage('Install Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm install'
                }
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
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

        stage('Copy Frontend Build to Backend') {
            steps {
                bat 'xcopy /E /I /Y "E:\\jenkins\\public\\build" "E:\\jenkins\\server\\public\\build"'
            }
        }

        stage('Start Backend with PM2') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'set PM2_HOME=E:\\jenkins\\.pm2 && npx pm2 restart mern-app || npx pm2 start index.js --name mern-app'
                }
            }
        }
    }

    post {
        success {
            echo "✅ MERN app deployed successfully!"
            echo "🌐 Available at http://localhost:5000"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
