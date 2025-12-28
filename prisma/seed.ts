import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import "dotenv/config"

const db = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10)

  const user1 = await db.user.upsert({
    where: { email: "antonio@mail.com" },
    update: {},
    create: {
      email: "antonio@mail.com",
      name: "Antonio",
      password: hashedPassword,
      image: "/avatars/antonio.png", // Placeholder
    },
  })

  const user2 = await db.user.upsert({
    where: { email: "john@mail.com" },
    update: {},
    create: {
      email: "john@mail.com",
      name: "John",
      password: hashedPassword,
      image: "/avatars/john.png", // Placeholder
    },
  })
  
  // Create a Demo Workspace
  // Check if workspace exists
  const existingWorkspace = await db.workspace.findFirst({ where: { name: "Acme Corp" } })
  
  if (!existingWorkspace) {
    const workspace = await db.workspace.create({
      data: {
        name: "Acme Corp",
        ownerId: user1.id,
        inviteCode: "ACME123",
        members: {
          create: [
            { userId: user1.id, role: "ADMIN" },
            { userId: user2.id, role: "MEMBER" },
          ]
        },
        projects: {
          create: [
            { name: "Mobile App Development", imageUrl: "/icons/mobile.png" },
            { name: "Website Redesign", imageUrl: "/icons/web.png" },
          ]
        }
      },
      include: {
        projects: true
      }
    })
    
    // Seed some tasks
    const mobileProject = workspace.projects.find(p => p.name === "Mobile App Development")
    const webProject = workspace.projects.find(p => p.name === "Website Redesign")

    if (mobileProject) {
        await db.task.createMany({
            data: [
                { title: "Conduct usability testing", status: "BACKLOG", projectId: mobileProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-15"), position: 1000, priority: "HIGH" },
                { title: "Implement offline mode", status: "TODO", projectId: mobileProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-14"), position: 2000, priority: "MEDIUM" },
                { title: "Integrate push notifications", status: "BACKLOG", projectId: mobileProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-13"), position: 3000 },
                { title: "Develop login screen", status: "IN_REVIEW", projectId: mobileProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-12"), position: 4000 },
                { title: "Implement navigation flow", status: "TODO", projectId: mobileProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-11"), position: 5000, priority: "HIGH" },
                { title: "Design UI components", status: "IN_PROGRESS", projectId: mobileProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-10"), position: 6000, priority: "MEDIUM" },
                { title: "Create app wireframes", status: "DONE", projectId: mobileProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-09"), position: 7000 },
                { title: "Optimize images", status: "BACKLOG", projectId: mobileProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-05"), position: 8000 },
            ]
        })
    }

    if (webProject) {
        await db.task.createMany({
            data: [
                { title: "Write content for main pages", status: "IN_REVIEW", projectId: webProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-08"), position: 1000 },
                { title: "Implement user authentication", status: "IN_PROGRESS", projectId: webProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-07"), position: 2000, priority: "HIGH" },
                { title: "Integrate CMS", status: "TODO", projectId: webProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-06"), position: 3000, priority: "MEDIUM" },
                { title: "Design new homepage", status: "IN_PROGRESS", projectId: webProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-01"), position: 4000 },
                { title: "Implement responsive layout", status: "TODO", projectId: webProject.id, assigneeId: user1.id, dueDate: new Date("2024-10-04"), position: 5000 },
                { title: "Create sitemap", status: "DONE", projectId: webProject.id, assigneeId: user2.id, dueDate: new Date("2024-10-02"), position: 6000 },
            ]
        })
    }
  }

  console.log("Seeding finished.")
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })

