### 2.10.10 Atualizando o MySQL com Pacotes RPM Baixados Diretamente

É preferível usar o repositório Yum do MySQL ou [Repositório SLES do MySQL] para atualizar o MySQL em plataformas baseadas em RPM. No entanto, se você precisar atualizar o MySQL usando os pacotes RPM baixados diretamente da [MySQL Developer Zone] (consulte a Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle” para obter informações sobre os pacotes), navegue até a pasta que contém todos os pacotes baixados (e, preferencialmente, nenhum outro pacote RPM com nomes semelhantes) e execute o seguinte comando:

```sql
yum install mysql-community-{server,client,common,libs}-*
```

Substitua **yum** por **zypper** para sistemas SLES e por **dnf** para sistemas habilitados para dnf.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível como **yum** para instalar os pacotes, usuários que preferem comandos **rpm** diretos podem substituir o comando **yum install** pelo comando **rpm -Uvh**; no entanto, usar **rpm -Uvh** torna o processo de instalação mais propenso a falhas, devido a potenciais problemas de dependência que o processo de instalação pode encontrar.

Para uma instalação de atualização usando pacotes RPM, o MySQL server é reiniciado automaticamente ao final da instalação se estava em execução quando a instalação da atualização começou. Se o server não estava em execução quando a instalação da atualização começou, você deve reiniciar o server por conta própria após a conclusão da instalação da atualização; faça isso com, por exemplo, o seguinte comando:

```sql
service mysqld start
```

Assim que o server reiniciar, execute **mysql\_upgrade** para verificar e possivelmente resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql\_upgrade** também executa outras funções; consulte a Seção 4.4.7, “mysql\_upgrade — Verificar e Atualizar Tabelas MySQL” para obter detalhes.

Nota

Devido às relações de dependência entre os pacotes RPM, todos os pacotes instalados devem ser da mesma versão. Portanto, sempre atualize todos os seus pacotes instalados para MySQL. Por exemplo, não atualize apenas o server sem também atualizar o client, os arquivos comuns para bibliotecas de server e client, e assim por diante.

**Migração e Atualização a partir de instalações de pacotes RPM mais antigos.** Algumas versões mais antigas de pacotes RPM do MySQL Server tinham nomes no formato MySQL-\* (por exemplo, MySQL-server-\* e MySQL-client-\*). As versões mais recentes de RPMs, quando instaladas usando a ferramenta de gerenciamento de pacotes padrão (**yum**, **dnf** ou **zypper**), atualizam perfeitamente essas instalações mais antigas, tornando desnecessário desinstalar esses pacotes antigos antes de instalar os novos. Aqui estão algumas diferenças de comportamento entre os pacotes RPM mais antigos e os atuais:

**Tabela 2.16 Diferenças Entre os Pacotes RPM Anteriores e os Atuais para Instalar o MySQL**

| Recurso | Comportamento de Pacotes Anteriores | Comportamento de Pacotes Atuais |
| :--- | :--- | :--- |
| Serviço inicia após a conclusão da instalação | Sim | Não, a menos que seja uma instalação de atualização, e o server estivesse em execução quando a atualização começou. |
| Nome do Serviço | mysql | <p> Para RHEL, Oracle Linux, CentOS e Fedora: <span><strong>mysqld</strong></span> </p><p> Para SLES: <span><strong>mysql</strong></span> </p> |
| Arquivo de Log de Erros | Em <code>/var/lib/mysql/<em><code>hostname</code></em>.err</code> | <p> Para RHEL, Oracle Linux, CentOS e Fedora: em <code>/var/log/mysqld.log</code> </p><p> Para SLES: em <code>/var/log/mysql/mysqld.log</code> </p> |
| Enviado com o arquivo <code>/etc/my.cnf</code> | Não | Sim |
| Suporte a Multilib | Não | Sim |

Nota

A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf` e, em seguida, remova `/usr/my.cnf`.

**Atualizando para o MySQL Enterprise Server.** A atualização de uma versão community para uma versão comercial do MySQL requer que você primeiro desinstale a versão community e depois instale a versão comercial. Neste caso, você deve reiniciar o server manualmente após a atualização.

**Interoperabilidade com pacotes MySQL nativos do sistema operacional.** Muitas distribuições Linux fornecem o MySQL como uma parte integrada do sistema operacional. As versões mais recentes de RPMs da Oracle, quando instaladas usando a ferramenta de gerenciamento de pacotes padrão (**yum**, **dnf** ou **zypper**), atualizam e substituem perfeitamente a versão do MySQL que acompanha o sistema operacional, e o gerenciador de pacotes substitui automaticamente os pacotes de compatibilidade do sistema, como `mysql-community-libs-compat`, pelas novas versões relevantes.

**Atualizando a partir de pacotes MySQL não nativos.** Se você instalou o MySQL com pacotes de terceiros que NÃO são do repositório de software nativo de sua distribuição Linux (por exemplo, pacotes baixados diretamente do fornecedor), você deve desinstalar todos esses pacotes antes de poder atualizar usando os pacotes da Oracle.