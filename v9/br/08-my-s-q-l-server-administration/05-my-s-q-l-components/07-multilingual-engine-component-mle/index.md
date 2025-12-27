### 7.5.7 Componente do Motor Multilíngue (MLE)

7.5.7.1 Opção do Componente MLE e Referência de Variável

7.5.7.2 Status do Componente MLE e Informações da Sessão

7.5.7.3 Memória do Componente MLE e Uso de Fios

7.5.7.4 Uso de Programas Armazenados no Componente MLE

O componente do motor multilíngue (MLE) fornece suporte para linguagens além do SQL em procedimentos e funções armazenadas do MySQL. O Componente MLE está disponível como parte da Edição Empresarial do MySQL.

Com o componente MLE no MySQL 9.5, você pode criar e executar programas armazenados do MySQL escritos em JavaScript. Para mais informações sobre esses, consulte a Seção 27.3, “Programas Armazenados em JavaScript”. Para informações gerais sobre rotinas armazenadas do MySQL, consulte a Seção 27.2, “Uso de Rotinas Armazenadas”.

* Propósito: Fornecer suporte para linguagens além do SQL em funções e procedimentos armazenados. No MySQL 9.5, apenas JavaScript (ECMAScript) é suportado pelo MLE.

* URN: `file://component_mle`

Para instruções de instalação, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

O componente MLE está disponível em todas as plataformas suportadas pela Edição Empresarial do MySQL, exceto para Solaris. Consulte [Plataformas Suportáveis](https://www.mysql.com/support/supportedplatforms/database.html) para mais informações.

Nota

Você deve estar ciente de que nem todas as instalações do MySQL 9.5 suportam a remoção do componente MLE. Se sua instalação o suportar, você pode remover o componente usando `UNINSTALL COMPONENT`. Consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”, para informações sobre como fazer isso.

Para instalações do MySQL que suportam a desinstalação do componente MLE, você deve estar ciente de que não é possível realizar a desinstalação dentro de uma sessão de usuário que tenha criado ou executado quaisquer procedimentos armazenados em JavaScript. Por essa razão, recomendamos que você crie e execute procedimentos armazenados em JavaScript em uma sessão separada daquela usada para instalar o componente MLE; nesse caso, é possível, após sair da sessão na qual os procedimentos armazenados em JavaScript foram criados ou usados, desinstalar o componente em uma sessão separada.