#### 2.5.7.3. Implantação do MySQL no Windows e em outras plataformas não Linux com o Docker

Aviso

As imagens do Docker do MySQL fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens do Docker do MySQL da Oracle nelas estão fazendo isso por conta própria. Esta seção discute alguns problemas conhecidos para as imagens quando usadas em plataformas não Linux.

Problemas conhecidos para usar as imagens do Docker do servidor MySQL da Oracle no Windows incluem:

- Se você estiver montando em vínculo no diretório de dados MySQL do contêiner (consulte "Manter alterações de dados e configuração" para obter detalhes), você deve definir a localização do arquivo de soquete do servidor com a opção `--socket` para um local fora do diretório de dados MySQL; caso contrário, o servidor não conseguirá iniciar. Isso ocorre porque a maneira como o Docker para Windows lida com o montagem de arquivos não permite que um arquivo de host seja montado em vínculo no arquivo de soquete.
