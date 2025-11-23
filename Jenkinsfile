pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Satyamkan10/mern-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t mern-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                // Windows-safe "stop if exists"
                bat '''
                docker ps -q -f name=mern-app >nul
                IF %ERRORLEVEL% EQU 0 (
                    docker stop mern-app
                    docker rm mern-app
                ) ELSE (
                    echo "No existing container found."
                )
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                bat 'docker run -d -p 5000:5000 --name mern-app mern-app'
            }
        }
    }

    post {
        success {
            echo "🚀 MERN App deployed via Docker!"
            echo "🌍 http://localhost:5000"
        }
        failure {
            echo "❌ Deployment failed."
        }
    }
}
