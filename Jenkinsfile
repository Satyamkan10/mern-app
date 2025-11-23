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
                 FOR /F "tokens=*" %%i IN ('docker ps -aq -f name=mern-app') DO (
            docker stop %%i
            docker rm %%i
        )
        echo Old container cleanup complete.
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
