import process from 'child_process';

class Ps {
  private readonly ps: string = '';
  private readonly processes: Process[] = [];

  constructor() {
    this.ps = process.spawnSync('ps', ['-axeo', 'pid,ppid,pcpu,pmem,user,command']).stdout.toString();
    for (const line of this.ps.split('\n')) {
      if (line.trimStart().startsWith('PID')) {
        continue;
      }

      const [pid, ppid, cpu, memory, user, command] = line.split(' ');
      this.processes.push(new Process(parseInt(pid), parseFloat(cpu), parseFloat(memory), command, parseInt(ppid), user));
    }
  }

  public getProcesses(): Process[] {
    return this.processes;
  }
}



class Process {
  pid = 0;
  ppid = 0;
  cpu = 0;
  memory  = 0;
  pmemory = 0;
  command = '';
  user = '';

  constructor(pid: number, cpu: number, memory: number, command: string, ppid = 0, user = '', pmemory = 0) {
    this.command = command;
    this.pid = pid;
    this.ppid = ppid;
    this.user = user;
    this.cpu = cpu;
    this.memory = memory;
    this.pmemory = pmemory;
  }
}

export default Ps;
