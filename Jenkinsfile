pipeline {
    agent any

    environment {
        IMAGE_NAME = "weather-app"
        CONTAINER_NAME = "weather-container"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/BharathMalayalam/Weather_app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 80:80 --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }
    }
}