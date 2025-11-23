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

        stage('Deploy Container') {
            steps {
                bat 'docker stop mern-app || true'
                bat 'docker rm mern-app || true'
                bat 'docker run -d -p 5000:5000 --name mern-app mern-app'
            }
        }
    }

    post {
        success {
            echo "🚀 MERN App deployed via Docker!"
            echo "🌐 Available at: http://localhost:5000"
        }
        failure {
            echo "❌ Deployment failed."
        }
    }
}
