import 'reflect-metadata'
import { ApplicationConfiguration } from './infrastructure/configuration/ApplicationConfiguration'
import { RepositoryConfiguration } from './infrastructure/configuration/RepositoryConfiguration'

// Configure repositories
RepositoryConfiguration.configure()

// Configure application services
ApplicationConfiguration.configure()
