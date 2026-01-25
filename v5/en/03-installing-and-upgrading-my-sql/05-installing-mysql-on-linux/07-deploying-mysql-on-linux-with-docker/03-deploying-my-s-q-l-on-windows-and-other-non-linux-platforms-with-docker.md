#### 2.5.7.3 Implantando MySQL no Windows e Outras Plataformas Não-Linux com Docker

Aviso

As imagens Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens Docker do MySQL da Oracle nelas o fazem por sua conta e risco. Esta seção discute alguns problemas conhecidos para as imagens quando usadas em plataformas não-Linux.

Problemas Conhecidos para o uso das imagens Docker do Servidor MySQL da Oracle no Windows incluem:

*   Se você estiver fazendo *bind-mounting* no *data directory* do MySQL do container (consulte Persistência de Dados e Alterações de Configuração para detalhes), você deve definir a localização do *server socket file* com a opção `--socket` para algum lugar fora do *MySQL data directory*; caso contrário, o *server* falha ao iniciar. Isso ocorre porque a maneira como o Docker for Windows lida com a montagem de arquivos não permite que um *host file* seja *bind-mounted* no *socket file*.