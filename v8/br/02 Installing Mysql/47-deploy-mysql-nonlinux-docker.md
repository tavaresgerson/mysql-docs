#### 2.5.6.3 Implantação do MySQL no Windows e outras plataformas não-Linux com o Docker

Aviso

As imagens do MySQL Docker fornecidas pela Oracle são construídas especificamente para plataformas Linux. Outras plataformas não são suportadas, e os usuários que executam as imagens do MySQL Docker da Oracle nelas o fazem por sua conta e risco.

Problemas conhecidos para usar as imagens do Docker do MySQL Server da Oracle no Windows incluem:

- Se você estiver montando o bind no diretório de dados MySQL do contêiner (consulte Persisting Data e Configuration Changes para detalhes), você deve definir a localização do arquivo do socket do servidor com a opção `--socket` para algum lugar fora do diretório de dados MySQL; caso contrário, o servidor não inicia. Isso ocorre porque a maneira como o Docker para Windows lida com a montagem de arquivos não permite que um arquivo host seja montado no socket.
