const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const appUtils = require("../utils/appUtils");

const readHTMLFile = (path, callback) => {
  fs.readFile(
    path,
    {
      encoding: "utf-8",
    },
    function (err, html) {
      if (err) {
        throw err;
      } else {
        callback(null, html);
      }
    }
  );
};

/**
 * Send email using nodemailer
 * @param {Object} payload - Email payload
 * @param {string} payload.service - Email service (default: Gmail)
 * @param {string} payload.user - Email user/address
 * @param {string} payload.pass - Email password/app password
 * @param {string} payload.fromEmail - From email address
 * @param {string} payload.to - Recipient email
 * @param {string} payload.subject - Email subject
 * @param {string} payload.template - Template filename in emailTemplate folder
 * @param {Object} payload.data - Data to inject into template
 * @param {Array} payload.attachment - Optional attachments
 */
const sendMail = async (payload) => {
  try {
    const transporter = nodemailer.createTransport({
      service: payload?.service || "Gmail",
      auth: {
        user: payload?.user || process.env.EMAIL_USER || "noreply@ggtodo.com",
        pass: payload?.pass || process.env.EMAIL_PASS || "",
      },
    });

    const fromEmail =
      payload?.fromEmail ||
      `"GG TODO" <${process.env.EMAIL_USER || "noreply@ggtodo.com"}>`;
    const toEmail = payload.to;
    const subject = payload.subject;

    readHTMLFile(
      __dirname + `/emailTemplate/${payload.template}`,
      function (err, html) {
        if (err) {
          throw err;
        }

        const template = handlebars.compile(html);
        const data = payload.data;
        const htmlToSend = template(data);

        const mailOptions = {
          from: fromEmail,
          to: toEmail,
          subject: subject,
          html: htmlToSend,
        };

        if (payload.attachment && payload.attachment.length) {
          mailOptions.attachments = payload.attachment;
        }

        return new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error("mail-error", err);
              reject(err);
            } else {
              console.log("mail-response", info.response);
              resolve(info.response);
            }
          });
        });
      }
    );
  } catch (error) {
    appUtils.logError({
      moduleName: "services-email",
      methodName: "sendMail",
      error,
    });
    throw error;
  }
};

/**
 * Send onboarding welcome email
 * @param {Object} user - User object with name and email
 * @param {string} appUrl - Application URL
 */
const sendOnboardingEmail = async (
  user,
  appUrl = process.env.APP_URL || "https://ggtodo.com"
) => {
  return sendMail({
    to: user.email,
    subject: "Welcome to GG TODO! 🎉",
    template: "onboarding.html",
    data: {
      name: user.name || "there",
      app_url: appUrl,
    },
  });
};

module.exports = {
  sendMail,
  sendOnboardingEmail,
};
