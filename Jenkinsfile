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
        FRONTEND_BUILD = "${WORKSPACE}/public/build"
        BACKEND_BUILD_DEST = "${WORKSPACE}/server/public/build"
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
                // Ensure destination exists
                bat 'if not exist "%BACKEND_BUILD_DEST%" mkdir "%BACKEND_BUILD_DEST%"'

                // Copy the build output
                bat 'xcopy /E /I /Y "%FRONTEND_BUILD%" "%BACKEND_BUILD_DEST%"'
            }
        }

        stage('Restart Backend') {
            steps {
                bat 'pm2 restart mern-app --update-env'
            }
        }
    }

    post {
        success {
            echo "🚀 MERN app deployed successfully!"
            echo "🌍 Available at http://localhost:5000"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
