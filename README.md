# Code Crafters

Welcome to the GitHub repository for Code Crafter's Raspberry Pi IoT DirFram project!

## Project Description

This project aims to develop software for a Raspberry Pi that automatically executes when connected via USB or UART to retrieve information from an IoT device. The software will gather details such as firmware version, chip model, and voltage usage, compiling them into an XML format. This information can be stored onboard the Raspberry Pi or transmitted to another system for analysis.

## Demo Video

Watch our project demo: [CodeCrafters-Demo1](https://drive.google.com/drive/folders/1C7eJl1ASyc34OYd9XrLWe7_obueCJH8E?usp=sharing)

## Functional Requirements (SRS) Document

Access the Functional Requirements document [here](https://github.com/COS301-SE-2024/IoT-DIRfram/wiki/Functional-Requirements).

## GitHub Project Board

Check out our GitHub Project Board for project management: [Project Board](https://github.com/orgs/COS301-SE-2024/projects/50)

## Team Members

- **Quintin d'Hotman de Villiers**
  - Role: Project Manager
  - LinkedIn: [Quintin d'Hotman](https://www.linkedin.com/in/quintin-d-hotman-de-villiers-8563b4240/)

- **Lloyd Creighton**
  - Role: Software Developer
  - LinkedIn: [Lloyd Creighton](https://www.linkedin.com/in/lloyd-creighton-8367822b9/)

- **Carter Shin**
  - Role: Testing Engineer
  - LinkedIn: [Carter Shin](https://za.linkedin.com/in/carter-shin-b0483b243)

- **Ze-Lin(Daniel) Zhang**
  - Role: Software Developer
  - LinkedIn: [Ze-Lin Zhang](https://www.linkedin.com/in/z%C3%A9-lin-zhang-a87676241/)

- **Yi-Rou(Monica) Hung**
  - Role: Dev-Ops
  - LinkedIn: [Yi-Rou Hung](https://www.linkedin.com/in/yi-rou-hung-7bb6a6305?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BEZJLj7i3R5mMJu94ANnKCg%3D%3D)

## Git Repository

### Git Structure (Mono Repo)

Our repository follows a mono repo structure to organize all project-related files and code in a single repository.

### Git Organization and Management

We use Git for version control, allowing for collaborative development and easy tracking of changes.

### Branching Strategy

We follow the Git Flow branching model, with main, develop, feature, and release branches to manage development and release processes efficiently.

### Code Quality Badges

- **Code Coverage:** None
- **Build:** GitHub Actions
- **Requirements:** None
- **Issue Tracking:** GitHub Issues

## Monitoring

We do not have a server for housing the XML data as it is stored locally on the Raspberry Pi for now, and thus don't need to utilize software such as NodePing for monitoring server uptime and performance.

## Conclusion

With this comprehensive GitHub documentation, we aim to provide transparency and insight into our project's development process, organization, and team members. We welcome collaboration and feedback from the Course co-ordinators, clients, or any other members involved with the project.

## Notes

When Creating a branch, please base it off Dev and push it to Dev, not main when merging.
Please also put the readme in a .gitignore file
