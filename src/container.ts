import { ApplicationConfiguration } from '@/infrastructure/configuration/ApplicationConfiguration'
import { ControllerConfiguration } from '@/infrastructure/configuration/ControllerConfiguration'
import { RepositoryConfiguration } from '@/infrastructure/configuration/RepositoryConfiguration'
import { TaskConfiguration } from '@/infrastructure/configuration/TaskConfiguration'

// Configure dependencies
ApplicationConfiguration.configure()
ControllerConfiguration.configure()
RepositoryConfiguration.configure()
TaskConfiguration.configure()
