#### 2.5.6.3 Implantação do MySQL no Windows e em outras Plataformas Não Linux com Docker

Aviso

As imagens Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens Docker do MySQL da Oracle nelas estão fazendo isso por conta própria. Esta seção discute alguns problemas conhecidos para as imagens quando usadas em plataformas não Linux.

Problemas conhecidos para o uso das imagens Docker do MySQL Server da Oracle no Windows incluem:

* Se você estiver montando por vinculação no diretório de dados do MySQL do contêiner (consulte Persistência de Mudanças de Dados e Configurações para detalhes), você deve definir a localização do arquivo de soquete do servidor com a opção `--socket` para um local fora do diretório de dados do MySQL; caso contrário, o servidor não consegue iniciar. Isso ocorre porque a maneira como o Docker para Windows lida com o montagem de arquivos não permite que um arquivo de host seja montado por vinculação no arquivo de soquete.