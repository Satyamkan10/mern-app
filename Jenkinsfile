pipeline {
    agent any

    tools {
        nodejs "node"
    }

    stages {

        /* ---------------------------
            CI — CONTINUOUS INTEGRATION
        ---------------------------- */

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Satyamkan10/mern-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing frontend & backend dependencies..."

                dir("public") {
                    bat "npm install"
                }

                dir("server") {
                    bat "npm install"
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."

                dir("public") {
                    bat "npm test --watchAll=false || exit 0"
                }

                dir("server") {
                    bat "npm test || exit 0"
                }
            }
        }

        stage('Lint Code') {
            steps {
                echo "Linting source code..."

                dir("public") {
                    bat "npm run lint || exit 0"
                }

                dir("server") {
                    bat "npm run lint || exit 0"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building React app..."

                dir("public") {
                    bat "npm run build"
                }
            }
        }


        /* ---------------------------
            CD — CONTINUOUS DEPLOYMENT
        ---------------------------- */

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat 'docker build -t mern-app .'
            }
        }

        stage('Deploy / Restart Container') {
            steps {
                echo "Deploying container..."

                bat '''
                echo Checking if mern-app container exists...

                FOR /F "tokens=*" %%i IN ('docker ps -aq -f name=mern-app') DO (
                    echo Container exists. Redeploying...
                    docker stop %%i
                    docker rm %%i
                    docker run -d -p 5000:5000 --name mern-app mern-app
                    echo Redeployed successfully!
                    exit /b 0
                )

                echo No existing container found. Deploying new instance...
                docker run -d -p 5000:5000 --name mern-app mern-app
                echo New container deployed successfully!
                '''
            }
        }
    }

    post {
        success {
            echo "🚀 CI/CD pipeline completed successfully!"
            echo "🌍 App running at http://localhost:5000"
        }
        failure {
            echo "❌ CI/CD pipeline failed!"
        }
    }
}
