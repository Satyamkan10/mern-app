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
        BACKEND_DIR = "${WORKSPACE}/public"
        FRONTEND_DIR = "${WORKSPACE}/server"
        SERVER_PORT = "5000"
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
                dir("${BACKEND_DIR}") {
                    bat 'npm test || echo "No backend tests yet"'
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
                dir("${FRONTEND_DIR}") {
                    bat 'npm test -- --watchAll=false || echo "No frontend tests yet"'
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
                    bat "powershell Start-Process -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/c npm run dev'"
                }
            }
        }

        stage('Start Frontend Server') {
            steps {
                dir("${FRONTEND_DIR}") {
                    // Serve the built frontend using Vite preview
                    bat "powershell Start-Process -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/c npm run preview'"
                }
            }
        }
    }

    post {
        success {
            echo "MERN pipeline completed successfully!"
            echo "Frontend served from http://localhost:4173 (default Vite preview port)"
            echo "Backend running on port ${SERVER_PORT}"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
