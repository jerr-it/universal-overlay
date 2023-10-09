import process from 'child_process';

export class Ps {
  private readonly ps: string = '';
  private readonly processes: Process[] = [];

  constructor(ignoreSystemProcesses = true) {
    this.ps = process.spawnSync('ps', ['-axeo', 'pid,ppid,pcpu,pmem,rsz,user,command']).stdout.toString();
    for (const line of this.ps.split('\n')) {
      if (line.trimStart().startsWith('PID')) {
        continue;
      }

      const matchedLine = line.trimStart().match(/(\S+)/g);
      const pid = matchedLine?.at(0);
      const ppid = matchedLine?.at(1);
      const cpu = matchedLine?.at(2);
      const pmemory = matchedLine?.at(3);
      const memory = matchedLine?.at(4);
      const user = matchedLine?.at(5);
      const command = matchedLine?.at(6)
      const args = matchedLine?.slice(7);
      if (
        pid === undefined ||
        ppid === undefined ||
        cpu === undefined ||
        memory === undefined ||
        user === undefined ||
        command === undefined ||
        args === undefined ||
        pmemory === undefined
      ) {
        continue;
      }

      if (command.startsWith('ps')) {
        continue;
      }

      if (ignoreSystemProcesses && (user === 'root' || (command.startsWith('[') && command.endsWith(']')))) {
        continue;
      }

      this.processes.push(new Process(parseInt(pid), parseFloat(cpu), parseFloat(memory), command, parseInt(ppid), user, parseFloat(pmemory), args));
    }
  }

  public getProcesses(): Process[] {
    return this.processes;
  }
}



export class Process {
  public pid = 0;
  public ppid = 0;
  public cpu = 0;
  public memory  = 0;
  public pmemory = 0;
  public command = '';
  public args: string[] = [];
  public user = '';

  constructor(pid: number, cpu: number, memory: number, command: string, ppid = 0, user = '', pmemory = 0, args: string[] = []) {
    this.command = command;
    this.pid = pid;
    this.ppid = ppid;
    this.user = user;
    this.cpu = cpu;
    this.memory = memory;
    this.pmemory = pmemory;
    this.args = args;
  }

  public toString(): string {
    return `PID: ${this.pid}, PPID: ${this.ppid}, CPU: ${this.cpu}, Memory: ${this.memory}, PMemory: ${this.pmemory}, User: ${this.user}, Command: ${this.command}, Args: ${this.args}`;
  }

  public static kill(pid: number) {
    // Signal 9 is SIGKILL
    process.spawnSync('kill', ["-9", pid.toString()]);
  }

  public static quit(pid: number) {
    // Signal 15 is SIGTERM
    process.spawnSync('kill', ['-15', pid.toString()]);
  }


}

export default {
  Ps,
  Process
}
