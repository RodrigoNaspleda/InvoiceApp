import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Edit, Trash, Home, Users, Clock, Mail } from "lucide-react"

export default function InvoicesApp() {
  const [activeSection, setActiveSection] = useState('home')

  const [clients, setClients] = useState<{ id: number, name: string, contact: string, email: string }[]>([])
  const [newClient, setNewClient] = useState({ id: clients.length + 1, name: '', contact: '', email: '' })
  const [editingClient, setEditingClient] = useState<number | null>(null)

  const [contracts, setContracts] = useState<{ id: number, clientId: number, employees: { id: number, rate: number }[] }[]>([])
  const [newContract, setNewContract] = useState({ id: contracts.length + 1, clientId: 0, employees: [] as { id: number, rate: number }[] })
  const [editingContract, setEditingContract] = useState<number | null>(null)

  const [employees, setEmployees] = useState<{ id: number, name: string, seniority: string, phone: string, email: string, dni: string }[]>([])
  const [newEmployee, setNewEmployee] = useState({ id: employees.length + 1, name: '', seniority: '', phone: '', email: '', dni: '' })
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null)

  const [invoices, setInvoices] = useState<{ id: number, contractId: number, employees: { id: number, name: string, seniority: string, phone: string, email: string, dni: string, hours: number, rate: number }[], total: number }[]>([])
  const [editingInvoice, setEditingInvoice] = useState<number | null>(null)
  const [currentEmployees, setCurrentEmployees] = useState<{ id: number, name: string, seniority: string, phone: string, email: string, dni: string, hours: number, rate: number }[]>([])

  const addClient = () => {
    if (newClient.name && newClient.contact && newClient.email) {
      setClients([...clients, { ...newClient }])
      setNewClient({ id: clients.length + 2, name: '', contact: '', email: '' })
    }
  }

  const editClient = (id: number) => {
    setEditingClient(id)
    const client = clients.find(client => client.id === id)
    if (client) {
      setNewClient(client)
    }
  }

  const saveClient = (id: number) => {
    const updatedClients = clients.map(client => 
      client.id === id ? { ...client, name: newClient.name, contact: newClient.contact, email: newClient.email } : client
    )
    setClients(updatedClients)
    setEditingClient(null)
    setNewClient({ id: clients.length + 1, name: '', contact: '', email: '' })
  }

  const deleteClient = (id: number) => {
    const updatedClients = clients.filter(client => client.id !== id)
    setClients(updatedClients)
  }

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.seniority && newEmployee.phone && newEmployee.email && newEmployee.dni) {
      setEmployees([...employees, { ...newEmployee }])
      setNewEmployee({ id: employees.length + 2, name: '', seniority: '', phone: '', email: '', dni: '' })
    }
  }

  const editEmployee = (id: number) => {
    setEditingEmployee(id)
    const employee = employees.find(employee => employee.id === id)
    if (employee) {
      setNewEmployee(employee)
    }
  }

  const saveEmployee = (id: number) => {
    const updatedEmployees = employees.map(employee => 
      employee.id === id ? { ...employee, name: newEmployee.name, seniority: newEmployee.seniority, phone: newEmployee.phone, email: newEmployee.email, dni: newEmployee.dni } : employee
    )
    setEmployees(updatedEmployees)
    setEditingEmployee(null)
    setNewEmployee({ id: employees.length + 1, name: '', seniority: '', phone: '', email: '', dni: '' })
  }

  const deleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter(employee => employee.id !== id)
    setEmployees(updatedEmployees)
  }

  const addContract = () => {
    if (newContract.clientId && newContract.employees.length > 0) {
      setContracts([...contracts, { ...newContract }])
      setNewContract({ id: contracts.length + 2, clientId: 0, employees: [] })
    }
  }

  const editContract = (id: number) => {
    setEditingContract(id)
    const contract = contracts.find(contract => contract.id === id)
    if (contract) {
      setNewContract(contract)
    }
  }

  const saveContract = (id: number) => {
    const updatedContracts = contracts.map(contract => 
      contract.id === id ? { ...contract, clientId: newContract.clientId, employees: newContract.employees } : contract
    )
    setContracts(updatedContracts)
    setEditingContract(null)
    setNewContract({ id: contracts.length + 1, clientId: 0, employees: [] })
  }

  const deleteContract = (id: number) => {
    const updatedContracts = contracts.filter(contract => contract.id !== id)
    setContracts(updatedContracts)
  }

  const assignEmployeeToContract = (employeeId: number) => {
    if (!newContract.employees.some(emp => emp.id === employeeId)) {
      setNewContract({ ...newContract, employees: [...newContract.employees, { id: employeeId, rate: 0 }] })
    }
  }

  const removeEmployeeFromContract = (employeeId: number) => {
    setNewContract({ ...newContract, employees: newContract.employees.filter(emp => emp.id !== employeeId) })
  }

  const updateEmployeeRateInContract = (employeeId: number, rate: number) => {
    setNewContract({ ...newContract, employees: newContract.employees.map(emp => emp.id === employeeId ? { ...emp, rate } : emp) })
  }

  const generateInvoices = () => {
    const newInvoices = [...invoices]
    const total = currentEmployees.reduce((acc, employee) => acc + employee.rate * employee.hours, 0)
    newInvoices.push({ id: invoices.length, contractId: newContract.id, employees: [...currentEmployees], total })
    setInvoices(newInvoices)
    setCurrentEmployees([])
  }

  const editInvoice = (id: number) => {
    setEditingInvoice(id)
    const invoice = invoices.find(invoice => invoice.id === id)
    if (invoice) {
      setCurrentEmployees(invoice.employees)
      setNewContract({ id: invoice.contractId, clientId: 0, employees: invoice.employees.map(emp => emp.id) })
    }
  }

  const saveInvoice = (id: number) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === id ? { ...invoice, employees: currentEmployees, total: currentEmployees.reduce((acc, employee) => acc + employee.rate * employee.hours, 0) } : invoice
    )
    setInvoices(updatedInvoices)
    setEditingInvoice(null)
    setCurrentEmployees([])
  }

  const deleteInvoice = (id: number) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id)
    setInvoices(updatedInvoices)
  }

  const updateHours = (index: number, hours: number) => {
    const updatedEmployees = currentEmployees.map((employee, i) => 
      i === index ? { ...employee, hours } : employee
    )
    setCurrentEmployees(updatedEmployees)
  }

  const updateEmployeeRateInInvoice = (index: number, rate: number) => {
    const updatedEmployees = currentEmployees.map((employee, i) => 
      i === index ? { ...employee, rate } : employee
    )
    setCurrentEmployees(updatedEmployees)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Invoices App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button variant="link" onClick={() => setActiveSection('home')}>
                  <Home className="mr-2 h-4 w-4" /> Home
                </Button>
              </li>
              <li>
                <Button variant="link" onClick={() => setActiveSection('clients')}>
                  <Users className="mr-2 h-4 w-4" /> Clients
                </Button>
              </li>
              <li>
                <Button variant="link" onClick={() => setActiveSection('employees')}>
                  <Users className="mr-2 h-4 w-4" /> Employees
                </Button>
              </li>
              <li>
                <Button variant="link" onClick={() => setActiveSection('contracts')}>
                  <Clock className="mr-2 h-4 w-4" /> Contracts
                </Button>
              </li>
              <li>
                <Button variant="link" onClick={() => setActiveSection('invoices')}>
                  <Mail className="mr-2 h-4 w-4" /> Invoices
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Home</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contracts.map(contract => (
                      <div key={contract.id} className="border p-4 rounded">
                        <p className="font-bold">Client: {clients.find(client => client.id === contract.clientId)?.name}</p>
                        <p>Employees: {contract.employees.map(emp => employees.find(e => e.id === emp.id)?.name).join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map(employee => (
                      <div key={employee.id} className="border p-4 rounded">
                        <p className="font-bold">{employee.name}</p>
                        <p>Seniority: {employee.seniority}</p>
                        <p>Phone: {employee.phone}</p>
                        <p>Email: {employee.email}</p>
                        <p>DNI: {employee.dni}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.map(invoice => (
                      <div key={invoice.id} className="border p-4 rounded">
                        <p className="font-bold">Contract: {contracts.find(contract => contract.id === invoice.contractId)?.clientId}</p>
                        <p>Total: ${invoice.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {activeSection === 'clients' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Clients</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingClient !== null ? 'Edit Client' : 'Add Client'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client-name">Name</Label>
                    <Input id="client-name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="client-contact">Contact</Label>
                    <Input id="client-contact" value={newClient.contact} onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="client-email">Email</Label>
                    <Input id="client-email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {editingClient !== null ? (
                  <Button onClick={() => saveClient(editingClient)}>Save Client</Button>
                ) : (
                  <Button onClick={addClient}>Add Client</Button>
                )}
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map(client => (
                    <div key={client.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{client.name}</p>
                        <p>Contact: {client.contact}</p>
                        <p>Email: {client.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => editClient(client.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => deleteClient(client.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeSection === 'employees' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Employees</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingEmployee !== null ? 'Edit Employee' : 'Add Employee'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee-name">Name</Label>
                    <Input id="employee-name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="employee-seniority">Seniority</Label>
                    <Select value={newEmployee.seniority} onValueChange={(value) => setNewEmployee({ ...newEmployee, seniority: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select seniority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employee-phone">Phone</Label>
                    <Input id="employee-phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="employee-email">Email</Label>
                    <Input id="employee-email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="employee-dni">DNI</Label>
                    <Input id="employee-dni" value={newEmployee.dni} onChange={(e) => setNewEmployee({ ...newEmployee, dni: e.target.value })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {editingEmployee !== null ? (
                  <Button onClick={() => saveEmployee(editingEmployee)}>Save Employee</Button>
                ) : (
                  <Button onClick={addEmployee}>Add Employee</Button>
                )}
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map(employee => (
                    <div key={employee.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{employee.name}</p>
                        <p>Seniority: {employee.seniority}</p>
                        <p>Phone: {employee.phone}</p>
                        <p>Email: {employee.email}</p>
                        <p>DNI: {employee.dni}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => editEmployee(employee.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => deleteEmployee(employee.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeSection === 'contracts' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Contracts</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingContract !== null ? 'Edit Contract' : 'Add Contract'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract-client">Client</Label>
                    <Select value={newContract.clientId.toString()} onValueChange={(value) => setNewContract({ ...newContract, clientId: parseInt(value) })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contract-employees">Employees</Label>
                    <div className="space-y-2">
                      {employees.map(employee => (
                        <div key={employee.id} className="flex items-center">
                          <Input id={`employee-${employee.id}`} type="checkbox" checked={newContract.employees.some(emp => emp.id === employee.id)} onChange={() => assignEmployeeToContract(employee.id)} />
                          <Label htmlFor={`employee-${employee.id}`} className="ml-2">{employee.name}</Label>
                          {newContract.employees.some(emp => emp.id === employee.id) && (
                            <div className="ml-4">
                              <Label htmlFor={`employee-rate-${employee.id}`} className="mr-2">Rate</Label>
                              <Input id={`employee-rate-${employee.id}`} type="number" value={newContract.employees.find(emp => emp.id === employee.id)?.rate || 0} onChange={(e) => updateEmployeeRateInContract(employee.id, parseFloat(e.target.value))} />
                            </div>
                          )}
                          {newContract.employees.some(emp => emp.id === employee.id) && (
                            <Button variant="destructive" onClick={() => removeEmployeeFromContract(employee.id)} className="ml-2">
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {editingContract !== null ? (
                  <Button onClick={() => saveContract(editingContract)}>Save Contract</Button>
                ) : (
                  <Button onClick={addContract}>Add Contract</Button>
                )}
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.map(contract => (
                    <div key={contract.id} className="border p-4 rounded">
                      <p className="font-bold">Client: {clients.find(client => client.id === contract.clientId)?.name}</p>
                      <p>Employees: {contract.employees.map(emp => employees.find(e => e.id === emp.id)?.name).join(', ')}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => editContract(contract.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" onClick={() => deleteContract(contract.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeSection === 'invoices' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Invoices</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contractors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {employees.map((employee, index) => (
                    <div key={employee.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{employee.name}</p>
                        <p>Seniority: {employee.seniority}</p>
                        <p>Phone: {employee.phone}</p>
                        <p>Email: {employee.email}</p>
                        <p>DNI: {employee.dni}</p>
                        <div className="flex items-center">
                          <Label htmlFor={`hours-${index}`} className="mr-2">Hours</Label>
                          <Input id={`hours-${index}`} type="number" value={currentEmployees.find(emp => emp.id === employee.id)?.hours || 0} onChange={(e) => updateHours(index, parseFloat(e.target.value))} />
                        </div>
                        <div className="flex items-center">
                          <Label htmlFor={`rate-${index}`} className="mr-2">Rate</Label>
                          <Input id={`rate-${index}`} type="number" value={currentEmployees.find(emp => emp.id === employee.id)?.rate || 0} onChange={(e) => updateEmployeeRateInInvoice(index, parseFloat(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={generateInvoices}>Generate Invoice</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map(invoice => (
                    <div key={invoice.id} className="border p-4 rounded">
                      {editingInvoice === invoice.id ? (
                        <div className="space-y-4">
                          {invoice.employees.map((employee, index) => (
                            <div key={employee.id} className="flex justify-between items-center">
                              <div>
                                <p className="font-bold">{employee.name}</p>
                                <p>Seniority: {employee.seniority}</p>
                                <p>Phone: {employee.phone}</p>
                                <p>Email: {employee.email}</p>
                                <p>DNI: {employee.dni}</p>
                                <div className="flex items-center">
                                  <Label htmlFor={`edit-hours-${index}`} className="mr-2">Hours</Label>
                                  <Input id={`edit-hours-${index}`} type="number" value={employee.hours} onChange={(e) => updateHours(index, parseFloat(e.target.value))} />
                                </div>
                                <div className="flex items-center">
                                  <Label htmlFor={`edit-rate-${index}`} className="mr-2">Rate</Label>
                                  <Input id={`edit-rate-${index}`} type="number" value={employee.rate} onChange={(e) => updateEmployeeRateInInvoice(index, parseFloat(e.target.value))} />
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-end">
                            <Button onClick={() => saveInvoice(invoice.id)}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            {invoice.employees.map((employee, index) => (
                              <div key={employee.id}>
                                <p className="font-bold">{employee.name}</p>
                                <p>Seniority: {employee.seniority}</p>
                                <p>Phone: {employee.phone}</p>
                                <p>Email: {employee.email}</p>
                                <p>DNI: {employee.dni}</p>
                                <p>Hours: {employee.hours}</p>
                                <p>Rate: ${employee.rate.toFixed(2)}</p>
                              </div>
                            ))}
                            <p className="font-bold">Total: ${invoice.total.toFixed(2)}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => editInvoice(invoice.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" onClick={() => deleteInvoice(invoice.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
