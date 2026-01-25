### 5.7.1 Configurando Múltiplos Data Directories

Cada MySQL Instance em uma máquina deve ter seu próprio Data Directory. A localização é especificada usando a opção [`--datadir=dir_name`](server-system-variables.html#sysvar_datadir).

Existem diferentes métodos para configurar um Data Directory para uma nova Instance:

* Criar um novo Data Directory.
* Copiar um Data Directory existente.

A discussão a seguir fornece mais detalhes sobre cada método.

Aviso

Normalmente, você nunca deve ter dois servers que atualizam dados nos mesmos Databases. Isso pode levar a surpresas desagradáveis se o seu sistema operacional não suportar system locking livre de falhas. Se (apesar deste aviso) você executar múltiplos servers usando o mesmo Data Directory e eles tiverem o logging ativado, você deve usar as opções apropriadas para especificar nomes de arquivos de log que sejam exclusivos para cada server. Caso contrário, os servers tentarão fazer log nos mesmos arquivos.

Mesmo quando as precauções precedentes são observadas, este tipo de configuração funciona apenas com tabelas `MyISAM` e `MERGE`, e não com nenhuma das outras storage engines. Além disso, este aviso contra o compartilhamento de um Data Directory entre servers sempre se aplica em um ambiente NFS. Permitir que múltiplos servers MySQL acessem um Data Directory comum via NFS é uma *ideia muito ruim*. O problema principal é que o NFS é o gargalo de velocidade (speed bottleneck). Ele não foi feito para tal uso. Outro risco com NFS é que você deve elaborar uma maneira de garantir que dois ou mais servers não interfiram um com o outro. Geralmente, o file locking do NFS é tratado pelo daemon `lockd`, mas no momento não existe plataforma que execute locking 100% confiavelmente em todas as situações.

#### Criar um Novo Data Directory

Com este método, o Data Directory está no mesmo estado de quando você instala o MySQL pela primeira vez. Ele possui o conjunto padrão de contas MySQL e nenhum dado de usuário.

No Unix, inicialize o Data Directory. Consulte [Section 2.9, “Postinstallation Setup and Testing”](postinstallation.html "2.9 Postinstallation Setup and Testing").

No Windows, o Data Directory está incluído na distribuição do MySQL:

* Distribuições de arquivo Zip do MySQL para Windows contêm um Data Directory não modificado. Você pode descompactar tal distribuição em uma localização temporária e, em seguida, copiar seu diretório `data` para onde você está configurando a nova Instance.

* Instaladores de pacote MSI do Windows criam e configuram o Data Directory que o server instalado usa, mas também criam um Data Directory "template" (modelo) original chamado `data` sob o diretório de instalação. Após uma instalação ter sido realizada usando um pacote MSI, o Data Directory template pode ser copiado para configurar Instances MySQL adicionais.

#### Copiar um Data Directory Existente

Com este método, quaisquer contas MySQL ou dados de usuário presentes no Data Directory são transferidos para o novo Data Directory.

1. Pare a MySQL Instance existente que está usando o Data Directory. Este deve ser um shutdown limpo para que a Instance descarregue (flushes) quaisquer alterações pendentes no disco.

2. Copie o Data Directory para o local onde o novo Data Directory deve estar.

3. Copie o arquivo de opção `my.cnf` ou `my.ini` usado pela Instance existente. Isso serve como base para a nova Instance.

4. Modifique o novo arquivo de opção para que quaisquer pathnames (caminhos) que se refiram ao Data Directory original se refiram ao novo Data Directory. Além disso, modifique quaisquer outras opções que devam ser exclusivas por Instance, como o número da porta TCP/IP e os arquivos de log. Para uma lista de parâmetros que devem ser exclusivos por Instance, consulte [Section 5.7, “Running Multiple MySQL Instances on One Machine”](multiple-servers.html "5.7 Running Multiple MySQL Instances on One Machine").

5. Inicie a nova Instance, instruindo-a a usar o novo arquivo de opção.